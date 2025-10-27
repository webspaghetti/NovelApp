function ChapterTitle({ chapter, customizationTemplate, inter }) {
    return (
        <h1 className={`text-center pb-6 text_outline ${customizationTemplate.title.outline}`} style={{
            '--shadow-color': customizationTemplate.title.outline_color,
            fontFamily: customizationTemplate.title.family === 'Inter' ? inter.style.fontFamily : customizationTemplate.title.family,
            fontSize: customizationTemplate.title.size,
            fontWeight: customizationTemplate.title.weight,
            color: customizationTemplate.chapter_title_color,
            borderBottom: `${customizationTemplate.text.separator_width} solid ${customizationTemplate.text.separator_color}`,
            lineHeight: customizationTemplate.title_spacing.line_height,
            wordSpacing: customizationTemplate.title_spacing.word_spacing,
            letterSpacing: customizationTemplate.title_spacing.letter_spacing
        }}>
            {chapter.chapterTitle || "Failed to display"}
        </h1>
    )
}


export default ChapterTitle;