function ChapterDetails({ chapter, customizationTemplate, inter }) {
    return (
        <div className="max-sm:text-base text-lg pb-4 border-b-gray-400 border-b-2 chapter-content">
            {chapter.chapterContent ? (
                <div
                    dangerouslySetInnerHTML={{
                        __html: chapter.chapterContent.replace(
                            /<p\s[^>]*>/g,
                            `<p style="margin: ${customizationTemplate.text_spacing.block_spacing} 0; line-height: ${customizationTemplate.text_spacing.line_height}; word-spacing: ${customizationTemplate.text_spacing.word_spacing}; letter-spacing: ${customizationTemplate.text_spacing.letter_spacing};">`
                        ),
                    }}
                    className={`text_outline ${customizationTemplate.text.outline}`} style={{
                    '--shadow-color': customizationTemplate.text.outline_color,
                    fontFamily: customizationTemplate.text.family === 'Inter' ? inter.style.fontFamily : customizationTemplate.text.family,
                    fontSize: customizationTemplate.text.size,
                    fontWeight: customizationTemplate.text.weight,
                    color: customizationTemplate.chapter_content_color,
                }}
                />
            ) : (
                <div className="flex flex-col justify-center items-center text-center text-xl">
                    <p>Failed to display the chapter.</p>
                    <p>Retry, and if the issue continues across multiple chapters, consider changing the novel&apos;s source.</p>
                    <button className={"mt-4"} onClick={() => location.reload()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                        </svg>
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
}


export default ChapterDetails;
