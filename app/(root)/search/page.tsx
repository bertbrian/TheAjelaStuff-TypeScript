import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import { getAllProducts, getAllCategories } from "@/lib/actions/product.action";
import Link from "next/link";

const prices = [
  {
    name: "1 - 500.000",
    value: "1-500000",
  },
  {
    name: "500.001 - 1.000.000",
    value: "500001-1000000",
  },
  {
    name: "1.000.001 - 1.500.000",
    value: "1000001-1500000",
  },
  {
    name: "1.500.001 - 2.000.000",
    value: "1500001-2000000",
  },
  {
    name: "2.000.001 - 2.500.000",
    value: "2050001-2500000",
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ["newest", "lowest", "highest", "rating"];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ""}
      ${isCategorySet ? `: Category ${category}` : ""}
      ${isPriceSet ? `: Price ${price}` : ""}
      ${isRatingSet ? `: Rating ${rating}` : ""}`,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  // Construct filter url
  const getFilterUrl = ({
    c,
    p,
    s,
    r,
    pg,
  }: {
    c?: string;
    p?: string;
    s?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5 ">
      <div className="filter-links">
        {/* Category Link */}
        <div className="text-xl mb-2 mt-4">Department</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                Any
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${
                    category === x.category && "font-bold"
                  } capitalize`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Link */}
        <div className="text-xl mb-2 mt-4">Price (IDR)</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${category === "all" && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`${price === p.value && "font-bold"} capitalize`}
                  href={getFilterUrl({ c: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Rating Link */}
        <div className="text-xl mb-2 mt-4">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === "all" && "font-bold"}`}
                href={getFilterUrl({ r: "all" })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`${
                    price === r.toString() && "font-bold"
                  } capitalize`}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  {`${r} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-4 md:col-span-4 ">
        <div className="flex-between flex-col my-4 md:flex-row">
          <div className="flex items-center">
            {q !== "all" && q !== "" && "Query: " + q}
            {category !== "all" && category !== "" && "Category: " + category}
            {price !== "all" && " Price : " + price}
            {rating !== "all" && " Rating : " + rating + " stars & up"}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant={"link"} asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by{" "}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort === s && "font-bold"}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div> No products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
