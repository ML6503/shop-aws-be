// export default {
//   type: "object",
//   properties: {
//     name: { type: 'string' }
//   },
//   required: ['name']
// } as const;

// export default {
//   type: "object",
//   pathParameters: {
//     productId: { type: 'string' }
//   },
// } as const;

export default {
  type: "object",
   properties:{
      message: {
         type: "string"
      }
   }

} as const;
