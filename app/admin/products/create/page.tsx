import ProductForm from "@/components/admin/product-form";
import { duplicateProduct, getProductById } from "@/lib/actions/product.action";
import { Product } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Product",
};

const CreateProductPage = async (props: {
  searchParams: Promise<{
    id?: string;
  }>;
}) => {
  const { id } = await props.searchParams;
  let duplicatedProduct = {};
  if (id) {
    const res = await getProductById(id);
    duplicatedProduct = { ...res, images: [] };
  }

  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        {id ? (
          <ProductForm
            type="Duplicate"
            product={duplicatedProduct as Product}
          />
        ) : (
          <ProductForm type="Create" />
        )}
      </div>
    </>
  );
};

export default CreateProductPage;
