import React from 'react'

const ForgotPassword = () => {
    return (
        <div className='d-flex justify-content-center py-2 px-2 mb-4 mb-md-5'>
            <div className='col-12 col-md-8 col-lg-6 col-xl-4 shadow border rounded px-2 py-2 p-md-5'>
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="text-center">
                            <h3><i class="fa fa-lock fa-4x"></i></h3>
                            <h2 class="text-center">Forgot Password?</h2>
                            <p>You can reset your password here.</p>
                            <div class="panel-body">

                                <form class="form">
                                    <fieldset>
                                        <div class="input-group mb-3">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text rounded-0" id="basic-addon1"><i className='fas fa-envelope py-1 '></i></span>
                                            </div>
                                            <input type="text" class="form-control" placeholder="Enter Email" />
                                        </div>
                                        <div class="form-group">
                                            <input class="btn btn-lg btn-primary btn-block w-100" value="Send My Password" type="submit" />
                                        </div>
                                    </fieldset>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword