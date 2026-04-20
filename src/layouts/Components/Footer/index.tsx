import React, { FC } from 'react';

type FooterProps = {};

const Footer: FC<FooterProps> = (props) => {
    return (
        <div className="w-full flex justify-center items-center py-[20px] text-[16px] text-[#454d64]">
            Open-source MIT Licensed | © 2023-present
        </div>
    );
};

export default Footer;
