import { productFragment, cartFragment } from './fragments';

export const getProductsQuery = /* GraphQL */ `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
          updatedAt
        }
      }
    }
  }
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: 100, sortKey: CREATED, reverse: true) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;
export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

export const getCustomerQuery = /* GraphQL */ `
  query getCustomer($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    firstName
    lastName
    displayName
    email
    phone
    orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
          id
          orderNumber
          processedAt
          financialStatus
          fulfillmentStatus
            totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 5) {
              edges {
                node {
                title
                quantity
                  originalTotalPrice {
                  amount
                  currencyCode
                }
                  variant {
                    image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
      defaultAddress {
      id
      address1
      address2
      city
      province
      zip
      country
      phone
    }
    addresses(first: 10) {
        edges {
          node {
          id
          address1
          address2
          city
          province
          zip
          country
          phone
        }
      }
    }
  }
}
`;
