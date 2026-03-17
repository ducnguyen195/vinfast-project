import Home from '../src/pages/Home';

export default Home;

export async function getServerSideProps(context) {
	const protocol = context.req.headers['x-forwarded-proto'] || 'http';
	const host = context.req.headers.host;
	const baseUrl = `${protocol}://${host}`;

	try {
		const [productsRes, postsRes] = await Promise.all([
			fetch(`${baseUrl}/api/products`),
			fetch(`${baseUrl}/api/posts`),
		]);

		const [productsJson, postsJson] = await Promise.all([
			productsRes.json(),
			postsRes.json(),
		]);

		return {
			props: {
				initialProducts: productsJson?.data || [],
				initialPosts: (postsJson?.data || []).slice(0, 3),
			},
		};
	} catch (error) {
		return {
			props: {
				initialProducts: [],
				initialPosts: [],
			},
		};
	}
}
