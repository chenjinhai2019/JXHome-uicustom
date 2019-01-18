import React from 'react';

// 设置 dom
export function layerdom(layer, zIndex) {
    console.log("button 设置",layer.estyle);
    return <button className="submit-inner" data-type="submit" data-submittype="all"
                   dangerouslySetInnerHTML={{ __html: layer.data.buttonValue }} />;
}
