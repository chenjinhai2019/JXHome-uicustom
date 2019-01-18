import React from 'react';

// 设置 dom
export function layerdom(layer, zIndex) {
    console.log("设置dom",layer);
    return <input className="layer-val" type="input:text"
                  data-keyname={layer.data.sign}
                  placeholder={layer.data.hint}
                  value={layer.data.inputValue} />;
}
