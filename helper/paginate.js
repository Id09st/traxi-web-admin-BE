const paginate = (totalCount, currentPage, pageSize) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const startRow = (currentPage - 1) * pageSize;
    const endRow = currentPage * pageSize;

    return {
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        totalCount: totalCount,
        startRow: startRow,
        endRow: endRow
    };
};

module.exports = {
    paginate
}