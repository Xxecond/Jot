 function SearchBar({ setSearchTerm }) {
  return (
    <div className="flex justify-end mt-10 pr-10">
      <input
        type="search"
        placeholder="Search blogs..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-2/5 md:w-1/3  placeholder:text-black dark:placeholder:text-white placeholder:tracking-tighter text-black dark:text-white px-4 border border-black dark:border-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition"
      />
    </div>
  );
}

export default SearchBar;
