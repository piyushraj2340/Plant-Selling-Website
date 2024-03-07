import React from 'react'

const TemplateTwoSectionAndRightVertical = ({ content, index, handelDeleteRendersUpload, handleImageUploadNurseryStore }) => {
    return (
        <>
            {
                content.images[0].url !== "" || content.images[1].url !== "" || content.images[2].url !== "" ?
                    <div className="p-0 template template-half-right-two template-images vertical rounded" >
                        <div className="template-half-right-two-first rounded border border-black position-relative">

                            {
                                content.images[0].url !== "" ?
                                    <div className="hover-images w-100 h-100">
                                        <img src={content.images[0].url} className='w-100 img-fluid rounded' alt="template images" />
                                        <div className="position-absolute images-options">
                                            <span className="fas fa-pen text-primary p-2"></span>
                                            <span className="fas fa-trash text-danger p-2"></span>
                                        </div>
                                    </div>
                                    :

                                    <>
                                        <label htmlFor={content.images[0]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                            <div className="template-header-complete rounded">
                                                <p><i className='fas fa-images'></i> Upload Images</p>
                                            </div>
                                        </label>
                                        <input type="file" name={content.images[0]._id} id={content.images[0]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[0]._id)} hidden />
                                    </>
                            }

                        </div>
                        <div className="template-half-right-two-second rounded d-flex flex-column w-100 h-100 rounded">
                            <div className="first bg-secondary w-100 h-50 d-flex justify-content-center align-items-center mb-1 rounded border border-black position-relative">
                                {
                                    content.images[1].url !== "" ?
                                        <div className="hover-images w-100 h-100">
                                            <img src={content.images[1].url} className='w-100 img-fluid rounded' alt="template images" />
                                            <div className="position-absolute images-options">
                                                <span className="fas fa-pen text-primary p-2"></span>
                                                <span className="fas fa-trash text-danger p-2"></span>
                                            </div>
                                        </div>
                                        :

                                        <>
                                            <label htmlFor={content.images[1]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                                <div className="template-header-complete rounded">
                                                    <p><i className='fas fa-images'></i> Upload Images</p>
                                                </div>
                                            </label>
                                            <input type="file" name={content.images[1]._id} id={content.images[1]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[1]._id)} hidden />
                                        </>
                                }
                            </div>
                            <div className="second bg-secondary w-100 h-50 d-flex justify-content-center align-items-center rounded border border-black position-relative">
                                {
                                    content.images[2].url !== "" ?
                                        <div className="hover-images w-100 h-100">
                                            <img src={content.images[2].url} className='w-100 img-fluid rounded' alt="template images" />
                                            <div className="position-absolute images-options">
                                                <span className="fas fa-pen text-primary p-2"></span>
                                                <span className="fas fa-trash text-danger p-2"></span>
                                            </div>
                                        </div>
                                        :

                                        <>
                                            <label htmlFor={content.images[2]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                                <div className="template-header-complete rounded">
                                                    <p><i className='fas fa-images'></i> Upload Images</p>
                                                </div>
                                            </label>
                                            <input type="file" name={content.images[2]._id} id={content.images[2]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[2]._id)} hidden />
                                        </>
                                }
                            </div>
                        </div>

                    </div>

                    :

                    <div className="template template-half-right-two vertical rounded position-relative hover-images" >
                        <div className="template-half-right-two-first rounded">
                            <label htmlFor={content.images[0]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                <div className="template-header-complete rounded">
                                    <p><i className='fas fa-images'></i> Upload Images</p>
                                </div>
                            </label>
                            <input type="file" name={content.images[0]._id} id={content.images[0]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[0]._id)} hidden />
                        </div>
                        <div className="template-half-right-two-second rounded d-flex flex-column align-items-center py-2 w-100 h-100 rounded">
                            <div className="first mb-2 bg-secondary w-100 h-50 d-flex justify-content-center align-items-center rounded">
                                <label htmlFor={content.images[1]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                    <div className="template-header-complete rounded">
                                        <p><i className='fas fa-images'></i> Upload Images</p>
                                    </div>
                                </label>
                                <input type="file" name={content.images[1]._id} id={content.images[1]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[1]._id)} hidden />
                            </div>
                            <div className="second bg-secondary w-100 h-50 d-flex justify-content-center align-items-center rounded">
                                <label htmlFor={content.images[2]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                    <div className="template-header-complete rounded">
                                        <p><i className='fas fa-images'></i> Upload Images</p>
                                    </div>
                                </label>
                                <input type="file" name={content.images[2]._id} id={content.images[2]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[2]._id)} hidden />
                            </div>
                        </div>
                        <div className="position-absolute images-options">
                            <span className="fas fa-trash text-danger p-2" onClick={() => handelDeleteRendersUpload(index)}></span>
                        </div>
                    </div>
            }


        </>

    )
}

export default TemplateTwoSectionAndRightVertical