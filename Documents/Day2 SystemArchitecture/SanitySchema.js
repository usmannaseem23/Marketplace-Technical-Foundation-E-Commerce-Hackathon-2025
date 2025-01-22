import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productTypes = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "additionalImages",
      title: "Additional Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discountPrice",
      title: "Discount Price",
      type: "number",
      description: "Discounted price of the product (optional)",
      validation: (Rule) =>
        Rule.custom((discountPrice, context) => {
          const doc = context.document;
          if (doc && typeof doc.price === "number") {
            if (discountPrice && discountPrice >= doc.price) {
              return "Discount price must be less than the original price";
            }
          }
          return true;
        }),
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      description: "Indicates whether the product is currently in stock",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stock",
      title: "Stock Quantity",
      type: "number",
      description: "Number of items available in stock",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Rating from 0 to 5",
      validation: (Rule) => Rule.min(0).max(5).precision(1),
    }),
    defineField({
      name: "reviews",
      title: "Reviews Count",
      type: "number",
      description: "Number of reviews for the product",
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      subtitle: "price",
      inStock: "inStock",
      stock: "stock",
    },
    prepare({ title, subtitle, media, inStock, stock }) {
      return {
        title,
        subtitle: `$${subtitle} | ${inStock ? `In Stock (${stock})` : "Out of Stock"}`,
        media,
      };
    },
  },
});