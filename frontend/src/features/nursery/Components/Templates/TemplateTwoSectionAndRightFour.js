import React from 'react'

const TemplateTwoSectionAndRightFour = ({ content, index, handelDeleteRendersUpload, handleImageUploadNurseryStore }) => {
    return (
        <>

            {
                content.images[0].url !== "" || content.images[1].url !== "" || content.images[2].url !== "" || content.images[3].url !== "" || content.images[4].url !== "" ?

                    <div className="p-0 template template-half-right-two template-images rounded" >
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
                        <div className="template-half-right-two-second rounded d-flex flex-column align-items-start h-100 rounded">
                            <div className="first w-100 h-50 d-flex rounded mb-1">
                                <div className='rounded border border-black position-relative me-1'>
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
                                <div className='rounded border border-black position-relative'>
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
                            <div className="second w-100 h-50 d-flex rounded">
                                <div className='rounded border border-black position-relative me-1'>
                                    {
                                        content.images[3].url !== "" ?
                                            <div className="hover-images w-100 h-100">
                                                <img src={content.images[3].url} className='w-100 img-fluid rounded' alt="template images" />
                                                <div className="position-absolute images-options">
                                                    <span className="fas fa-pen text-primary p-2"></span>
                                                    <span className="fas fa-trash text-danger p-2"></span>
                                                </div>
                                            </div>
                                            :

                                            <>
                                                <label htmlFor={content.images[3]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                                    <div className="template-header-complete rounded">
                                                        <p><i className='fas fa-images'></i> Upload Images</p>
                                                    </div>
                                                </label>
                                                <input type="file" name={content.images[3]._id} id={content.images[3]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[3]._id)} hidden />
                                            </>
                                    }
                                </div>
                                <div className='rounded border border-black position-relative'>
                                    {
                                        content.images[4].url !== "" ?
                                            <div className="hover-images w-100 h-100">
                                                <img src={content.images[4].url} className='w-100 img-fluid rounded' alt="template images" />
                                                <div className="position-absolute images-options">
                                                    <span className="fas fa-pen text-primary p-2"></span>
                                                    <span className="fas fa-trash text-danger p-2"></span>
                                                </div>
                                            </div>
                                            :

                                            <>
                                                <label htmlFor={content.images[4]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                                    <div className="template-header-complete rounded">
                                                        <p><i className='fas fa-images'></i> Upload Images</p>
                                                    </div>
                                                </label>
                                                <input type="file" name={content.images[4]._id} id={content.images[4]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[4]._id)} hidden />
                                            </>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>

                    :

                    <div className="template template-half-right-two rounded hover-images position-relative">
                        <div className="template-half-right-two-first rounded">
                            <label htmlFor={content.images[0]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                <div className="template-header-complete rounded">
                                    <p><i className='fas fa-images'></i> Upload Images</p>
                                </div>
                            </label>
                            <input type="file" name={content.images[0]._id} id={content.images[0]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[0]._id)} hidden />
                        </div>
                        <div className="template-half-right-two-second rounded d-flex flex-column w-100 h-100 rounded">
                            <div className="first mb-1 h-100 w-100 d-flex justify-content-center align-items-center rounded">
                                <div className='bg-secondary h-100 w-100 me-1 rounded d-flex justify-content-center align-items-center'>
                                    <label htmlFor={content.images[1]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                        <div className="template-header-complete rounded">
                                            <p><i className='fas fa-images'></i> Upload Images</p>
                                        </div>
                                    </label>
                                    <input type="file" name={content.images[1]._id} id={content.images[1]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[1]._id)} hidden />
                                </div>
                                <div className='bg-secondary h-100 w-100 rounded d-flex justify-content-center align-items-center'>
                                    <label htmlFor={content.images[2]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                        <div className="template-header-complete rounded">
                                            <p><i className='fas fa-images'></i> Upload Images</p>
                                        </div>
                                    </label>
                                    <input type="file" name={content.images[2]._id} id={content.images[2]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[2]._id)} hidden />
                                </div>
                            </div>
                            <div className="second h-100 w-100 d-flex justify-content-center align-items-center rounded">
                                <div className='bg-secondary h-100 w-100 me-1 rounded d-flex justify-content-center align-items-center'>
                                    <label htmlFor={content.images[3]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                        <div className="template-header-complete rounded">
                                            <p><i className='fas fa-images'></i> Upload Images</p>
                                        </div>
                                    </label>
                                    <input type="file" name={content.images[3]._id} id={content.images[3]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[3]._id)} hidden />
                                </div>
                                <div className='bg-secondary h-100 w-100 rounded d-flex justify-content-center align-items-center'>
                                    <label htmlFor={content.images[4]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                                        <div className="template-header-complete rounded">
                                            <p><i className='fas fa-images'></i> Upload Images</p>
                                        </div>
                                    </label>
                                    <input type="file" name={content.images[4]._id} id={content.images[4]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[4]._id)} hidden />
                                </div>
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

export default TemplateTwoSectionAndRightFour