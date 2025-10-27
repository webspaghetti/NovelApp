export default function ChapterStyleWrapper({ children, customizationTemplate }) {
    return (
        <div style={{
            backgroundColor: customizationTemplate.background.color,
            backgroundImage: customizationTemplate.background.image !== 'none' ? `url(${customizationTemplate.background.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            {children}
        </div>
    );
}