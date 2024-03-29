import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handelDataFetch from "../../utils/handelDataFetch";
import { userLogoutAsync } from "../auth/authSlice";
import { handelImageUploadNurseryHeader, handelImageUploadNurseryStore, handelAddNewPlantToNursery } from "./nurseryAPI";
import { message } from "antd";

const initialState = {
    nursery: null,
    nurseryStore: [],
    error: null,
    isLoading: false,
    isCurrentTab: "info",
    tabs: "Add new section",
}

//* ALL THE ASYNC FOR NURSERY_PROFILE
//? NURSERY_CREATE
export const nurseryCreateAsync = createAsyncThunk('/nursery/create', async (data) => {
    const response = await handelDataFetch('/api/v2/nursery/profile', 'POST', data);
    return response.data;
});

//? NURSERY_UPDATE
export const nurseryUpdateAsync = createAsyncThunk('/nursery/update', async ({ nurseryData, navigate }) => {
    const response = await handelDataFetch('/api/v2/nursery/profile', 'PATCH', nurseryData);
    return { result: response.data, navigate };
});

//? NURSERY_PROFILE_DATA
export const nurseryProfileAsync = createAsyncThunk('/nursery/profile', async () => {
    const response = await handelDataFetch('/api/v2/nursery/profile', 'GET');
    return response.data;
});

//? NURSERY_PROFILE_HEADER_IMAGE_UPLOAD
export const nurseryProfileImagesUpload = createAsyncThunk('/nursery/images/profile/upload', async (image) => {
    const response = await handelImageUploadNurseryHeader(image);
    return response.data;
});


//* ALL ASYNC OF NURSERY_PLANTS GOES HERE
export const addNewPlantsToNurseryAsync = createAsyncThunk('/nursery/plants/add', async (data) => {
    const response = await handelAddNewPlantToNursery(data.data);
    console.log(data);
    return { result: response.data, redirect: data.redirect, navigate: data.navigate };
});


//* ALL THE ASYNC FOR THE NURSERY_STORE_DATA
//? NURSERY_STORE_DATA
export const nurseryStoreDataAsync = createAsyncThunk('/nursery/store/data', async () => {
    const response = await handelDataFetch('/api/v2/nursery/store', 'GET');
    return response.data;
});

//? NURSERY_STORE_TEMPLATE_CREATE
export const addTemplateToStoreAsync = createAsyncThunk('/nursery/store/template/create', async ({ _id, data }) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/${_id}`, 'PATCH', data);
    return { result: response.data, _id };
});

//? NURSERY_STORE_SECTION_CREATE : TABS_CREATION
export const addNewTabSectionAsync = createAsyncThunk('/nursery/store/tab/section/create', async (data) => {
    const response = await handelDataFetch('/api/v2/nursery/store/', 'POST', data);
    return response.data;
});

//? NURSERY_STORE_SECTION_DELETE
export const deleteTabSectionAsync = createAsyncThunk('/nursery/store/tab/section/delete', async (_id) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/${_id}`, 'DELETE');
    return response.data;
});

//? NURSERY_STORE_TEMPLATE_IMAGES_UPLOAD
export const nurseryStoreImagesUpload = createAsyncThunk('/nursery/store/tab/section/image/upload', async ({ imageId, data }) => {
    const response = await handelImageUploadNurseryStore(imageId, data);
    return response.data;
});

//? NURSERY_STORE_TEMPLATE_DELETE
export const deleteTemplateFromSectionAsync = createAsyncThunk('/nursery/store/tab/template/delete', async ({ _id, data }) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/${_id}`, 'PATCH', data);
    return { result: response.data, _id };
});

//? NURSERY_STORE_TEMPLATE_RENDER_POSITION
export const changeTemplateRenderPositionAsync = createAsyncThunk('/nursery/store/tab/template/reorder', async ({ _id, data }) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/${_id}`, 'PATCH', data);
    return { result: response.data, _id };
});


export const nurserySlice = createSlice({
    name: 'nursery',
    initialState,
    reducers: {
        setIsCurrentTab: (state, action) => {
            state.isCurrentTab = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogoutAsync.fulfilled, () => {
                //* CLEANUP: TASK
                //? LOGOUT_CLEANUP_TASK:: REMOVE ALL THE CART INFORMATION AFTER LOGOUT

                return initialState;

            })
            .addCase(nurseryCreateAsync.pending, (state) => {
                //^ PENDING: NURSERY_CREATE

                state.isLoading = true;
                state.error = null;

            }).addCase(nurseryCreateAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_CREATE

                state.isLoading = false;
                state.nursery = action.payload.result;
                state.error = null;

                message.success(action.payload.message);

            }).addCase(nurseryCreateAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_CREATE

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);

            }).addCase(nurseryUpdateAsync.pending, (state) => {
                //^ PENDING: NURSERY_UPDATE

                state.isLoading = true;
                state.error = null;

            }).addCase(nurseryUpdateAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_UPDATE

                state.isLoading = false;
                state.nursery = action.payload.result.result;
                state.error = null;

                message.success(action.payload.result.message);

                //? IMPLEMENTATION: OF REDIRECT IF SUCCESSFUL UPDATES NURSERY 
                action.payload.navigate("/nursery");

            }).addCase(nurseryUpdateAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_UPDATE

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);

            }).addCase(nurseryProfileAsync.pending, (state) => {
                //^ PENDING: NURSERY_PROFILE

                state.isLoading = true;
                state.error = null;

            }).addCase(nurseryProfileAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_PROFILE

                state.isLoading = false;
                state.nursery = action.payload.result;
                state.error = null;

            }).addCase(nurseryProfileAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_PROFILE

                state.isLoading = false;
                state.error = action.error;

            }).addCase(nurseryProfileImagesUpload.pending, (state) => {
                //^ PENDING: NURSERY_HEADERS_IMAGES_UPLOAD

                state.isLoading = true;
                state.error = null;

                message.loading("Please wait we are uploading images...");

            }).addCase(nurseryProfileImagesUpload.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_HEADERS_IMAGES_UPLOAD

                // TODO: make only the changes of the images not all the data

                state.isLoading = false;
                state.nursery = action.payload.result;
                state.error = null;

                message.success(action.payload.message);

            }).addCase(nurseryProfileImagesUpload.rejected, (state, action) => {
                //! REJECTED: NURSERY_HEADERS_IMAGES_UPLOAD

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);
            }).addCase(addNewPlantsToNurseryAsync.pending, (state) => {
                //^ PENDING: ADD_PLANTS_TO_NURSERY

                state.isLoading = true;
                state.error = null;

            }).addCase(addNewPlantsToNurseryAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADD_PLANTS_TO_NURSERY

                state.isLoading = false;
                state.error = null;

                message.success(action.payload.result.message);
                action.payload.navigate(action.payload.redirect);

            }).addCase(addNewPlantsToNurseryAsync.rejected, (state, action) => {
                //! REJECTED: ADD_PLANTS_TO_NURSERY

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);

            }).addCase(nurseryStoreDataAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_DATA

                state.isLoading = true;
                state.nurseryStore = [];
                state.error = null;

            }).addCase(nurseryStoreDataAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_DATA

                state.isLoading = false;
                state.nurseryStore = action.payload.result;
                state.error = null;

            }).addCase(nurseryStoreDataAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_DATA

                state.isLoading = false;
                state.nurseryStore = [];
                state.error = action.error;

            }).addCase(addTemplateToStoreAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_ADD_TEMPLATE

                state.isLoading = true;
                state.error = null;

            }).addCase(addTemplateToStoreAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_ADD_TEMPLATE

                state.isLoading = false;

                // TODO: TRY TO IMPLEMENT ONLY UPDATE THE RENDER AFTER ADDING THE TEMPLATES.

                //? STEPS: 1. FIND THE CURRENT TAB BY USING 
                const index = state.nurseryStore.findIndex((tab) => tab._id === action.payload._id);
                //? STEPS: 2. UPDATE ALL THE DATA OF TABS 
                state.nurseryStore.splice(index, 1, action.payload.result.result);

                state.error = null;

            }).addCase(addTemplateToStoreAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_ADD_TEMPLATE

                state.isLoading = false;
                state.nurseryStore = null;
                state.error = action.error;

            }).addCase(addNewTabSectionAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_ADD_NEW_TAB_SECTION

                state.isLoading = true;
                state.error = null;

            }).addCase(addNewTabSectionAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_ADD_NEW_TAB_SECTION

                state.isLoading = false;
                state.isCurrentTab = action.payload.result.tabName;
                state.nurseryStore = state.nurseryStore.concat(action.payload.result);
                state.error = null;

            }).addCase(addNewTabSectionAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_ADD_NEW_TAB_SECTION

                state.isLoading = false;
                state.nurseryStore = null;
                state.error = action.error;

            }).addCase(deleteTabSectionAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_DELETE_TAB_SECTION

                state.isLoading = true;
                state.error = null;

                message.loading("Please wait we are deleting...");

            }).addCase(deleteTabSectionAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_DELETE_TAB_SECTION

                state.isLoading = false;
                state.isCurrentTab = initialState.isCurrentTab;

                //? DELETING THE SECTION DATA FROM THE NURSERY_STORE
                const index = state.nurseryStore.findIndex(tab => tab._id === action.payload.result._id);
                state.nurseryStore.splice(index, 1);
                state.error = null;

                message.success(action.payload.message);

            }).addCase(deleteTabSectionAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_DELETE_TAB_SECTION

                state.isLoading = false;
                state.nurseryStore = null;
                state.error = action.error;


                message.error(action.error.message);
            }).addCase(nurseryStoreImagesUpload.pending, (state) => {
                //^ PENDING: NURSERY_STORE_IMAGE_UPLOADING_TAB_SECTION

                state.isLoading = true;
                state.error = null;

                message.loading("Please wait we are uploading images...");

            }).addCase(nurseryStoreImagesUpload.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_IMAGE_UPLOADING_TAB_SECTION

                //? STEPS TO RENDER THE IMAGE AFTER UPLOADING 
                //& EXTRACTING THE TAB SECTION
                const tabIndex = state.nurseryStore.findIndex(tab => tab._id === action.payload.result.tabId);
                const tabContent = { ...state.nurseryStore[tabIndex] };

                //& EXTRACTING THE TEMPLATE SECTIONS: SUCH AS HEADER_TEMPLATE OR FOUR_SECTION
                const renderIndex = tabContent.renders.findIndex(render => render._id === action.payload.result.rendersId);
                const renderContent = { ...tabContent.renders[renderIndex] };

                //& EXTRACTING THE IMAGE POSITION AT WHICH PART IMAGE UPLOADED 
                const imageIndex = renderContent.images.findIndex(image => image._id === action.payload.result.imageId);
                const imageContent = { ...renderContent.images[imageIndex] };

                //& UPDATING THE URL OF THE IMAGES
                imageContent.public_id = action.payload.result.image.public_id;
                imageContent.url = action.payload.result.image.url;

                //~ STORING BACK FOR THE RENDERING 
                renderContent.images[imageIndex] = imageContent;
                tabContent.renders[renderIndex] = renderContent;
                state.nurseryStore[tabIndex] = tabContent;



                state.isLoading = false;
                message.success(action.payload.message);

            }).addCase(nurseryStoreImagesUpload.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_IMAGE_UPLOADING_TAB_SECTION

                state.isLoading = false;
                state.nurseryStore = null;
                state.error = action.error;


                message.error(action.error.message);
            }).addCase(deleteTemplateFromSectionAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_DELETE_TEMPLATE_FORM_TAB_SECTION

                state.isLoading = true;
                state.error = null;

            }).addCase(deleteTemplateFromSectionAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_DELETE_TEMPLATE_FORM_TAB_SECTION

                state.isLoading = false;

                // TODO: TRY TO IMPLEMENT ONLY UPDATE THE RENDER AFTER ADDING THE TEMPLATES.

                //? STEPS: 1. FIND THE CURRENT TAB BY USING 
                const index = state.nurseryStore.findIndex((tab) => tab._id === action.payload._id);
                //? STEPS: 2. UPDATE ALL THE DATA OF TABS 
                state.nurseryStore.splice(index, 1, action.payload.result.result);

                state.error = null;

            }).addCase(deleteTemplateFromSectionAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_DELETE_TEMPLATE_FORM_TAB_SECTION

                state.isLoading = false;
                state.nurseryStore = null;
                state.error = action.error;
            }).addCase(changeTemplateRenderPositionAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

            }).addCase(changeTemplateRenderPositionAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;

                // TODO: TRY TO IMPLEMENT ONLY UPDATE THE RENDER AFTER ADDING THE TEMPLATES.

                //? STEPS: 1. FIND THE CURRENT TAB BY USING 
                const index = state.nurseryStore.findIndex((tab) => tab._id === action.payload._id);
                //? STEPS: 2. UPDATE ALL THE DATA OF TABS 
                state.nurseryStore.splice(index, 1, action.payload.result.result);

                state.error = null;

            }).addCase(changeTemplateRenderPositionAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.nurseryStore = null;
                state.error = action.error;

            })
    }
});


export const { setIsCurrentTab } = nurserySlice.actions;
export default nurserySlice.reducer; 