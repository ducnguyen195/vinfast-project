import DetailProduct from '../../src/pages/DetailProduct';

export default DetailProduct;

export async function getServerSideProps(context) {
	const { slug } = context.params;
	const protocol = context.req.headers['x-forwarded-proto'] || 'http';
	const host = context.req.headers.host;
	const baseUrl = `${protocol}://${host}`;

	try {
		const res = await fetch(`${baseUrl}/api/products/slug/${slug}`);
		if (!res.ok) {
			return { notFound: true };
		}
		const json = await res.json();
		return {
			props: {
				initialProduct: json?.data || null,
			},
		};
	} catch (error) {
		return { notFound: true };
	}
}
