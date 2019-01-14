import React from 'react';

// 设置 dom
export function layerdom(layer, zIndex) {

    return <button className="submit-inner" data-type="submit" data-submittype="all" dangerouslySetInnerHTML={{ __html: layer.data }} />;
}
