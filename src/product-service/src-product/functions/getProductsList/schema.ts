export default {
  type: "application/json",
  properties: {
    products: { type: 'array' }
  },
  required: ['products']
} as const;
