import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Card({ item }) {
    if (!item) return null;

    const {
        image = '', // Default to an empty string if image is undefined
        images = [], // Default to an empty array if images are undefined
        title = 'No title available', // Default title
        price = 'N/A', // Default price
        extension = '', // Default to an empty string if extension is undefined
        _id,
    } = item;

    const navigate = useNavigate();

    const handleClick = () => {
        if (_id) {
            navigate(`/property/${_id}`);
        }
    };

    // Determine the image to display
    const imageUrl = images.length > 0 ? images[0] : image;

    return (
        <div
            className="hover:shadow-xl p-6 rounded-lg bg-primary text-primary cursor-pointer font-aller font-light transition duration-300 ease-in-out h-96 flex flex-col justify-between"
            onClick={handleClick}
            style={{ minWidth: '240px' }} // Ensure minimum width for consistency
        >
            {imageUrl ? (
                <img
                    className="rounded-lg mb-4 object-cover h-48 w-full"
                    src={imageUrl}
                    alt={`${title} image`}
                    style={{ objectFit: "cover" }} // Ensure image fits within the container
                />
            ) : (
                <div className="rounded-lg mb-4 font-aller font-light object-cover h-48 w-full bg-lightBlue flex items-center justify-center">
                    <span className="text-primary font-aller font-light">No Image Available</span>
                </div>
            )}
            <div className="flex flex-col font-aller font-light justify-between">
                <h3 className="text-2xl font-semibold text-primary font-aller font-light">
                    {price}
                </h3>
                <p className="text-primary font-semibold truncate mb-2 font-aller font-light">{title}</p>
                <p className="text-primary text-sm truncate font-aller font-light">{extension}</p>
            </div>
        </div>
    );
}

Card.propTypes = {
    item: PropTypes.shape({
        image: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
        title: PropTypes.string,
        price: PropTypes.string,
        extension: PropTypes.string,
        _id: PropTypes.string.isRequired,
    }).isRequired,
};
