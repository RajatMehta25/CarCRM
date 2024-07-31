import React from 'react'
// import dropbutton from '../images/drop_button.png'
// import docs from "../images/docs.png";
export default function FileInput(props) {
    const {error, label,id,info,images=[],onDelete,doctype="image"} = props;
    return (
      <>
      <div className="file_input_box_wrapper">
        <div className="added_images">
          {images.map(item=>{
            return <div className="img_box"><button onClick={(item)=>onDelete(item)}><i className="fa fa-times"></i></button>
            {/*<img src={doctype=="image"?item:docs}/>*/}
            </div>
          })}
        </div>
        
        <div className="file_input_box">
        <h3>{label} </h3>
        {/*<label htmlFor={id} className="drop_area">
            <img src={dropbutton}/>
            <span>Drag & Drop</span>
        </label>*/}
        <p>{info}</p>
        {/*<p className="warning">
        <span>Please note:</span> that it’s important to have a good image for your listing to stand out.</p>*/}
        </div>
        <input id={id} {...props} type="file" />
        {/*<div className="text-right">
        <label class="btn" htmlFor={id}>Browser</label>
      </div>*/}
        </div>
        {error ? (
          <p  
          style={{ paddingTop: 5,
          fontSize:13,
          color:"red" }}>
            {error}
          </p>
        ) : null}
      </>
    );
}
