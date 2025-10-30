import sourceConfig from "@/config/sourceConfig";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        const { formatted_name, chapter, source } = await request.json();

        // Validate inputs
        if (!formatted_name || !chapter || !source) {
            return Response.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Build the chapter URL using sourceConfig
        const params = { formatted_name, chapter };
        const url = sourceConfig[source].getChapterLink(params);

        console.log(`Prefetch request for chapter ${chapter}: ${url}`);

        // Call the scrape API (same as your page does)
        const cookieStore = cookies();

        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/scrape`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Cookie': cookieStore.toString()
            },
            body: JSON.stringify({ url }),
            cache: 'force-cache', // Cache the prefetched content
        });

        if (!response.ok) {
            throw new Error('Failed to prefetch chapter content');
        }

        const data = await response.json();

        return Response.json({
            success: true,
            chapter,
            title: data.content?.chapterTitle
        });

    } catch (error) {
        console.error('Prefetch error:', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}