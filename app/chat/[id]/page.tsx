export default async function Chat({ params } : { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <div>chat {id}</div>
}