// export default {
//   type: "object",
//   properties: {
//     name: { type: 'string' }
//   },
//   required: ['name']
// } as const;

export default {
  type: "object",
  pathParameters: { productId: '1' },
} as const;
