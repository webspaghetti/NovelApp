import sourceConfig from "@/config/sourceConfig"
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import {
    fetchNovelByFormattedNameAndSource,
    getUserNovel,
    getUserTemplates,
    updateUsersProgress
} from "@/lib/commonQueries";
import { authOptions } from "@/lib/auth";
import ChapterDetails from "@/components/chapter-page/ChapterDetails";
import ChapterNavigation from "@/components/chapter-page/ChapterNavigation";
import ChapterStyleWrapper from "@/components/chapter-page/ChapterStyleWrapper";
import BackButton from "@/components/novel-page/BackButton";
import sanitizeHtml from "sanitize-html";
import ChapterTitle from "@/components/chapter-page/ChapterTitle";


async function fetchChapterContent(url) {
    const cookieStore = cookies();

    const response = await fetch(`${process.env.PUBLIC_API_URL}/api/scrape`, {
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

    const normalTemplate = userTemplateList.find(t => t.id === userNovel.normal_template_id);
    const smallTemplate = userTemplateList.find(t => t.id === userNovel.small_template_id);

    // Update user progress
    await updateUsersProgress(session.user.id, novelData.id, currentChapter);

    // Get chapter link and fetch content
    const link = sourceConfig[novelData.source].getChapterLink(params);
    const chapter = await fetchChapterContent(link);

    if (chapter?.chapterContent) {
        chapter.chapterContent = sanitizeHtml(chapter.chapterContent, {
            allowedTags: ["p", "img", "strong", "em", "b", "i", "u", "a", "table"],
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

    const prevChapter = currentChapter - 1;
    const nextChapter = currentChapter + 1;


    return (
        <ChapterStyleWrapper normalCustomizationTemplate={normalTemplate} smallCustomizationTemplate={smallTemplate}>
            <main className={"px-5 mt-0 mb-0"}>
                <div>
                    <div className="flex justify-start mb-5">
                        <BackButton formattedName={novelData.formatted_name} source={novelData.source} />
                    </div>

                    <ChapterTitle chapter={chapter} normalCustomizationTemplate={normalTemplate} smallCustomizationTemplate={smallTemplate} />

                    <ChapterDetails chapter={chapter} normalCustomizationTemplate={normalTemplate} smallCustomizationTemplate={smallTemplate} />
                    <ChapterNavigation
                        prevChapter={prevChapter}
                        nextChapter={nextChapter}
                        currentChapter={currentChapter}
                        chapterCount={novelData.chapter_count}
                        formattedName={novelData.formatted_name}
                        source={novelData.source}
                    />
                </div>
            </main>
        </ChapterStyleWrapper>
    );
}


export default Page;