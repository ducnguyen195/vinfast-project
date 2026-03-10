import Posts from '../../src/pages/Posts';

export default Posts;

export async function getServerSideProps(context) {
	const protocol = context.req.headers['x-forwarded-proto'] || 'http';
	const host = context.req.headers.host;
	const baseUrl = `${protocol}://${host}`;

	try {
		const res = await fetch(`${baseUrl}/api/posts`);
		const json = await res.json();
		return {
			props: {
				initialPosts: json?.data || [],
			},
		};
	} catch (error) {
		return {
			props: {
				initialPosts: [],
			},
		};
	}
}
