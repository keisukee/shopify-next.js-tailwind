export default async function send(req, res) {
  const {
    query: { id },
  } = req;

  // const domain = process.env.SHOPIFY_STORE_DOMAIN
  // const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN
  const domain = 'urban-tech-hyd.myshopify.com';
  const storefrontAccessToken = 'd1a56749a326236d307cffd2178ce494';

  async function ShopifyData(query) {
    const URL = `https://${domain}/api/2022-10/graphql.json`;

    const options = {
      endpoint: URL,
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    };

    try {
      const data = await fetch(URL, options).then((response) => {
        return response.json();
      });

      return data;
    } catch (error) {
      throw new Error('Products not fetched');
    }
  }

  async function getProduct(handle) {
    const query = `
    {
      product(handle: "${handle}") {
        id
        variants(first: 25) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
      }
    }`;

    const response = await ShopifyData(query);

    const product = response.data.product ? response.data.product : [];

    return product;
  }

  const product = await getProduct(id);
  res.json(product);
}
