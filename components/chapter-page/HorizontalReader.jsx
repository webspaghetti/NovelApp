import BackButton from "@/components/novel-page/BackButton";
import ChapterTitle from "@/components/chapter-page/ChapterTitle";
import ChapterNavigation from "@/components/chapter-page/ChapterNavigation";

function HorizontalReader({ chapter, novelData, customizationTemplate, inter, prevChapter, nextChapter, currentChapter }) {
    const commonStyles = {
        fontFamily: customizationTemplate.text.family === 'Inter' ? inter.style.fontFamily : customizationTemplate.text.family,
        fontSize: customizationTemplate.text.size,
        fontWeight: customizationTemplate.text.weight,
        color: customizationTemplate.chapter_content_color,
    };

    if (!chapter.chapterContent) {
        return (
            <div className="flex flex-col justify-center items-center text-center text-xl h-screen">
                <p>Failed to display the chapter.</p>
                <p>Retry, and if the issue continues across multiple chapters, consider changing the novel&apos;s source.</p>
                <button className="mt-4 flex items-center gap-2" onClick={() => location.reload()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                    </svg>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-x-auto overflow-y-hidden pt-4 px-1">
            <div
                style={{
                    columnWidth: '60ch',
                    columnGap: '4rem',
                    columnFill: 'auto',
                    height: 'calc(100vh - 2rem)',
                }}
            >
                {/* Back Button */}
                <div className="mb-5">
                    <BackButton
                        formattedName={novelData.formatted_name}
                        source={novelData.source}
                        customizationTemplate={customizationTemplate}
                    />
                </div>

                {/* Chapter Title */}
                <ChapterTitle
                    chapter={chapter}
                    customizationTemplate={customizationTemplate}
                    inter={inter}
                />

                {/* Chapter Content */}
                <div
                    dangerouslySetInnerHTML={{
                        __html: chapter.chapterContent.replace(
                            /<p\s[^>]*>/g,
                            `<p style="margin: ${customizationTemplate.text_spacing.block_spacing} 0; line-height: ${customizationTemplate.text_spacing.line_height}; word-spacing: ${customizationTemplate.text_spacing.word_spacing}; letter-spacing: ${customizationTemplate.text_spacing.letter_spacing};">`
                        ),
                    }}
                    className={`text_outline ${customizationTemplate.text.outline}`}
                    style={{
                        ...commonStyles,
                        '--shadow-color': customizationTemplate.text.outline_color,
                    }}
                />

                {/* Chapter Navigation */}
                <div className="mt-8 pt-4" style={{
                    borderTop: `${customizationTemplate.text.separator_width} solid ${customizationTemplate.text.separator_color}`,
                }}>
                    <ChapterNavigation
                        prevChapter={prevChapter}
                        nextChapter={nextChapter}
                        currentChapter={currentChapter}
                        chapterCount={novelData.chapter_count}
                        formattedName={novelData.formatted_name}
                        source={novelData.source}
                        customizationTemplate={customizationTemplate}
                    />
                </div>
            </div>
        </div>
    );
}

export default HorizontalReader;