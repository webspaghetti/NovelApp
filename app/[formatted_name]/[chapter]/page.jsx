import sourceConfig from "@/config/sourceConfig"
import { notFound } from "next/navigation";
import { updateUsersProgress } from "@/app/helper-functions/updateUsersProgress";
import { fetchNovelByFormattedName } from "@/app/helper-functions/fetchNovelByFormattedName";
import ChapterDetails from "@/components/chapter-page/ChapterDetails";
import ChapterNavigation from "@/components/chapter-page/ChapterNavigation";
import ChapterStyleWrapper from "@/components/chapter-page/ChapterStyleWrapper";
import BackButton from "@/components/novel-page/BackButton";
import sanitizeHtml from "sanitize-html";


async function fetchChapterContent(url) {
    const response = await fetch(`${process.env.PUBLIC_API_URL}/api/scrape`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch chapter content');
    }

    const data = await response.json();
    return data.content;
}


async function Page({ params }) {
    const { formatted_name, chapter: chapterParam } = params;

    const novelData = await fetchNovelByFormattedName(formatted_name);

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

    // Update user progress
    await updateUsersProgress(1, novelData.id, currentChapter);

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
        <ChapterStyleWrapper>
            <main className={"px-5"}>
                <div>
                    <div className="flex justify-start mb-5">
                        <BackButton formattedName={formatted_name} />
                    </div>

                    <h1 className="border-b-gray-400 border-b-2 text-center max-sm:text-2xl text-3xl mb-4 pb-6 chapter-title">
                        {chapter.chapterTitle || "Failed to display"}
                    </h1>

                    <ChapterDetails chapter={chapter} />
                    <ChapterNavigation
                        prevChapter={prevChapter}
                        nextChapter={nextChapter}
                        currentChapter={currentChapter}
                        chapterCount={novelData.chapter_count}
                        formattedName={formatted_name}
                    />
                </div>
            </main>
        </ChapterStyleWrapper>
    );
}


export default Page;