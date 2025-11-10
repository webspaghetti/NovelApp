import sourceConfig from "@/config/sourceConfig"
import {cookies, headers} from "next/headers";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import {
    fetchNovelByFormattedNameAndSource,
    getUserNovel,
    getUserTemplates,
    updateUsersProgress
} from "@/lib/commonQueries";
import { authOptions } from "@/lib/auth";
import sanitizeHtml from "sanitize-html";
import ChapterPageWrapper from "@/components/chapter-page/ChapterPageWrapper";


async function fetchChapterContent(url) {
    const cookieStore = cookies();

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/scrape`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Cookie': cookieStore.toString()
        },
        body: JSON.stringify({ url }),
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch chapter content');
    }

    const data = await response.json();
    return data.content;
}


async function Page({ params, searchParams }) {
    const userAgent = headers().get('user-agent') || '';
    const isMobile = /mobile/i.test(userAgent);

    const session = await getServerSession(authOptions);

    const { formatted_name, chapter: chapterParam } = params;
    const source = Object.keys(searchParams || {})[0] ?? null;

    const novelData = await fetchNovelByFormattedNameAndSource(formatted_name, source);

    if (!novelData) {
        notFound();
    }

    const currentChapter = parseInt(chapterParam);

    // Validate chapter number
    if (
        currentChapter > novelData.chapter_count ||
        currentChapter < 1 ||
        isNaN(currentChapter)
    ) {
        notFound();
    }

    const userNovel = await getUserNovel(session.user.id, novelData.id);
    const userTemplateList = await getUserTemplates(session.user.id);


    // Update user progress
    await updateUsersProgress(session.user.id, novelData.id, currentChapter, source);

    // Get chapter link and fetch content
    const link = sourceConfig[novelData.source].getChapterLink(params);
    const chapter = await fetchChapterContent(link);

    if (chapter?.chapterContent) {
        chapter.chapterContent = sanitizeHtml(chapter.chapterContent, {
            allowedTags: ["p", "img", "strong", "em", "b", "i", "u", "a", "table", "sent"],
            allowedAttributes: {
                img: ["src", "alt"],
                a: ["href"],
                p: ["style"],
            },
            transformTags: {
                // remove ad/tracker images
                img: (tagName, attribs) => {
                    if (attribs.src?.includes("pubadx.one")) return { tagName: "span", text: "" };
                    return { tagName, attribs };
                },
            },
        }).replace(/<p>/g, '<p style="margin: 1rem 0;">');
    }


    return (
        <ChapterPageWrapper chapter={chapter} currentChapter={currentChapter} novelData={novelData} userTemplateList={userTemplateList} userNovel={userNovel} isMobile={isMobile} />
    );
}


export default Page;