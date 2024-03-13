import React from 'react'

const FullScreenImageView = ({ img, id }) => { // TODO: FIX THE ISSUE FOR THE NURSERY HEADER IMAGES OR CREATE YOUR OWN MODEL FOR THE IMAGES 
    return (
        <div className="modal fade p-0 m-0 overflow-hidden" id={id} tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
            <div className="modal-dialog modal-dialog-centered p-0 m-0" style={{ maxWidth: `${window.innerWidth}px`, width: `${(window.innerWidth)}px`, height: `${window.innerHeight}px` }}>
                <div className="modal-body p-0 m-0 d-flex justify-content-center align-items-center" >
                    <img src={img} alt="Image" className="img-fluid" />
                </div>
            </div>
        </div>
    )
}

export default FullScreenImageView