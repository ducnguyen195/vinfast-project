import Home from '../src/pages/Home';

export default Home;

export async function getServerSideProps(context) {
	const protocol = context.req.headers['x-forwarded-proto'] || 'http';
	const host = context.req.headers.host;
	const baseUrl = `${protocol}://${host}`;

	try {
		const res = await fetch(`${baseUrl}/api/products`);
		const json = await res.json();

		return {
			props: {
				initialProducts: json?.data || [],
			},
		};
	} catch (error) {
		return {
			props: {
				initialProducts: [],
			},
		};
	}
}
