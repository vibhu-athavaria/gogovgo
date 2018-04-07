import React from "react";

const ReviewsPagination = props => {
    if (!props.reviews || props.reviews.pages < 2) return null;

    const { page, pages } = props.reviews;

    /**
     * Component to render a single button
     * @param {number} page - Page number to get button for
     * @param {boolean} active - Whether the button/page is active or not
     * @returns {JSX}
     */
    const getBtn = (page, active) => (
        <li className={active ? "active" : null} key={page}>
            <a onClick={e => props.setPage(page)}>{page}</a>
        </li>
    );

    let buttons = [];

    //  calculate number of buttons to show before the active button
    let buttonsBefore;
    if (page === 1) {
        buttonsBefore = 0;
    } else if (page === pages) {
        buttonsBefore = 2;
    } else {
        buttonsBefore = 1;
    }

    //  add buttons to show before active
    while (buttonsBefore > 0) {
        buttons.splice(0, 0, getBtn(page - buttonsBefore));
        buttonsBefore -= 1;
    }
    buttons.reverse();

    //  add currently active button
    buttons.push(getBtn(page, true));

    //  add buttons to show after active
    let _page = page + 1;
    while (buttons.length < 3 && _page <= pages) {
        buttons.push(getBtn(_page));
        _page += 1;
    }

    return (
        <nav>
            <ul className="pagination">
                {page > 1 && (
                    <li>
                        <a onClick={e => props.setPage(page - 1)} disabled={page === 1}>
                            <span>&laquo;</span>
                        </a>
                    </li>
                )}
                {buttons.map(button => button)}
                {page < pages && (
                    <li>
                        <a onClick={e => props.setPage(page + 1)} disabled={page === pages}>
                            <span>&raquo;</span>
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default ReviewsPagination;
