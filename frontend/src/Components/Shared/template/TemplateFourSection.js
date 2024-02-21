import React from 'react'

const TemplateFourSection = ({ content, index, handelDeleteRendersUpload, handleImageUploadNurseryStore }) => {
    return (
        <> {
            content.images[0].url !== "" || content.images[1].url !== "" || content.images[2].url !== "" || content.images[3].url !== "" ?


                <div className="p-0 template template-four template-images rounded" >
                    <div className="template-first rounded border border-black position-relative">
                        {content.images[0].url !== "" ?

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
                                        <p className='text-center'><i className='fas fa-images'></i> Upload Images</p>
                                    </div>
                                </label>
                                <input type="file" name={content.images[0]._id} id={content.images[0]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[0]._id)} hidden />
                            </>
                        }

                    </div>
                    <div className="template-second rounded border border-black position-relative">
                        {content.images[1].url !== "" ?

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
                                        <p className='text-center'><i className='fas fa-images'></i> Upload Images</p>
                                    </div>
                                </label>
                                <input type="file" name={content.images[1]._id} id={content.images[1]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[1]._id)} hidden />
                            </>
                        }
                    </div>
                    <div className="template-third rounded border border-black position-relative">
                        {content.images[2].url !== "" ?

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
                                        <p className='text-center'><i className='fas fa-images'></i> Upload Images</p>
                                    </div>
                                </label>
                                <input type="file" name={content.images[2]._id} id={content.images[2]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[2]._id)} hidden />
                            </>
                        }
                    </div>
                    <div className="template-fourth rounded border border-black position-relative">
                        {content.images[3].url !== "" ?

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
                                        <p className='text-center'><i className='fas fa-images'></i> Upload Images</p>
                                    </div>
                                </label>
                                <input type="file" name={content.images[3]._id} id={content.images[3]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[3]._id)} hidden />
                            </>
                        }
                    </div>
                </div>

                :

                <div className="template template-four rounded position-relative hover-images" >
                    <div className="template-first rounded border border-black">
                        <label htmlFor={content.images[0]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                            <div className="template-header-complete rounded">
                                <p className='text-center'><i className='fas fa-images'></i> Upload Images</p>
                            </div>
                        </label>
                        <input type="file" name={content.images[0]._id} id={content.images[0]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[0]._id)} hidden />
                    </div>
                    <div className="template-second rounded border border-black">
                        <label htmlFor={content.images[1]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                            <div className="template-header-complete rounded">
                                <p className='text-center'><i className='fas fa-images'></i> Upload Images</p>
                            </div>
                        </label>
                        <input type="file" name={content.images[1]._id} id={content.images[1]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[1]._id)} hidden />
                    </div>
                    <div className="template-third rounded border border-black">
                        <label htmlFor={content.images[2]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                            <div className="template-header-complete rounded">
                                <p className='text-center'><i className='fas fa-images'></i> Upload Images</p>
                            </div>
                        </label>
                        <input type="file" name={content.images[2]._id} id={content.images[2]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[2]._id)} hidden />
                    </div>
                    <div className="template-fourth rounded border border-black">
                        <label htmlFor={content.images[3]._id} className='cursor-pointer m-0 p-0 w-full h-100 d-flex justify-content-center align-items-center'>
                            <div className="template-header-complete rounded">
                                <p className='text-center'><i className='fas fa-images'></i> Upload Images</p>
                            </div>
                        </label>
                        <input type="file" name={content.images[3]._id} id={content.images[3]._id} accept="image/png, image/jpeg" onChange={(e) => handleImageUploadNurseryStore(e, content._id, content.images[3]._id)} hidden />
                    </div>
                    <div className="position-absolute images-options">
                        <span className="fas fa-trash text-danger p-2" onClick={() => handelDeleteRendersUpload(index)}></span>
                    </div>
                </div>
        }

        </>

    )
}

export default TemplateFourSection