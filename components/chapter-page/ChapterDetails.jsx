function ChapterDetails({ chapter }) {
    return (
        <div className="max-sm:text-base text-lg pb-4 border-b-gray-400 border-b-2 chapter-content">
            {chapter.chapterContent ? (
                <div
                    dangerouslySetInnerHTML={{
                        __html: chapter.chapterContent.replace(/<p>/g, '<p style="margin: 1rem 0;">'),
                    }}
                />
            ) : (
                <div className={'text-center text-xl'}>
                    <p>This is most likely caused by the novel using partial chapter structure (1.1, 1.2, etc.).</p>
                    <p>Unfortunately, right now this makes these novels unavailable.</p>
                    <p>We&apos;re sorry :(</p>
                </div>
            )}
        </div>
    );
}


export default ChapterDetails;
