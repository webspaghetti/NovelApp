export default function ChapterStyleWrapper({ children, customizationTemplate }) {
    return (
        <div style={{
            backgroundColor: customizationTemplate.background.color,
            backgroundImage: customizationTemplate.background.image !== 'none' ? `url(${customizationTemplate.background.image})` : 'none',
            backgroundSize: customizationTemplate.background.size,
            backgroundPosition: customizationTemplate.background.position,
            backgroundAttachment: customizationTemplate.background.attachment,
            backgroundRepeat: customizationTemplate.background.repeat
        }}>
            {children}
        </div>
    );
}