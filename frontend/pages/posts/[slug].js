import DetailPost from '../../src/pages/DetailPost';

export default DetailPost;

export async function getServerSideProps(context) {
	const { slug } = context.params;
	const protocol = context.req.headers['x-forwarded-proto'] || 'http';
	const host = context.req.headers.host;
	const baseUrl = `${protocol}://${host}`;

	try {
		const res = await fetch(`${baseUrl}/api/posts/slug/${slug}`);
		if (!res.ok) {
			return { notFound: true };
		}
		const json = await res.json();
		return {
			props: {
				initialPost: json?.data || null,
			},
		};
	} catch (error) {
		return { notFound: true };
	}
}
