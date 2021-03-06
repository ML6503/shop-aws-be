export const AddProductRequest = {
  type: "application/json",
  properties: {
    title: {
      type: "string"
    },
    description: {
      type: "string"
    },
    price: {
      type: "number"
    },
    count: {
      type: "number"
    }
  },
  required: ["title", "price"]
};

export const AddProductResponse = {
  type: "object",
  properties: {
    id: {
      type: "string"
    },
    title: {
      type: "string"
    },
    description: {
      type: "string"
    },
    price: {
      type: "number"
    },
    count: {
      type: "number"
    }
  },
 
};
