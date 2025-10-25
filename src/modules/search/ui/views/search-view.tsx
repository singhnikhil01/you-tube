import CategoriesSection from "../sections/categories-section";
import { ResultSection } from "../sections/result-section";
interface SearchProps {
  query: string | undefined;
  categoryId?: string | undefined;
}

export const SearchView = ({ query, categoryId }: SearchProps) => {
  return (
    <div className="max-w-[1700px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId} />
      <ResultSection query={query} categoryId={categoryId} />
    </div>
  );
};
