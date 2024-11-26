import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handelDataFetch from "../../utils/handelDataFetch";
import { userLogoutAsync } from "../auth/authSlice";
import { handelImageUploadNurseryHeader, handelImageUploadNurseryStore, handelAddNewPlantToNursery, handelAddNewBlockToNursery, handelFetchDataWithImages } from "./nurseryAPI";
import { message } from "antd";
import ObjectArraySet from "../../utils/ObjectArraySet ";

const initialState = {
    nursery: null,
    nurseryStoreTabs: [],
    nurseryStoreTemplates: [],
    nurseryStoreBlocks: [],
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
    const response = await handelDataFetch('/api/v2/nursery/store/tab', 'POST', data);
    return response.data;
});

// //? NURSERY_STORE_SECTION_DELETE
// export const deleteTabSectionAsync = createAsyncThunk('/nursery/store/tab/section/delete', async (_id) => {
//     const response = await handelDataFetch(`/api/v2/nursery/store/${_id}`, 'DELETE');
//     return response.data;
// });

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



//* Added new nursery store data api handling

//? NURSERY_STORE_TABS_DATA_GET
export const nurseryStoreTabsGetAllAsync = createAsyncThunk('/nursery/store/tab/get', async () => {
    const response = await handelDataFetch('/api/v2/nursery/store/tab', 'GET');
    return response.data;
});


//? NURSERY_STORE_TABS_DATA_DELETE
export const nurseryStoreTabDeleteAsync = createAsyncThunk('/nursery/store/tab/delete', async (id) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/tab/${id}`, 'DELETE');
    return response.data;
});

//? NURSERY_STORE_TABS_DATA_EDIT
export const nurseryStoreTabEditAsync = createAsyncThunk('/nursery/store/tab/edit', async ({id, data}) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/tab/${id}`, 'PATCH', data);
    return response.data;
});



//? NURSERY_STORE_TEMPLATES_DATA_ADD_NEW
/*
* Structures of data Parameters 
    data : {
        nurseryStoreTabs: ids, index: 0,1,2..., templateName: "completeSection", "twoSection"....
    }
*/
export const AddNurseryStoreTemplatesAsync = createAsyncThunk('/nursery/store/template/add', async (data) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/template`, 'POST', data);
    return response.data;
});

//? NURSERY_STORE_TEMPLATES_DATA_GET_ALL
export const nurseryStoreTemplatesGetAllAsync = createAsyncThunk('/nursery/store/template/get/all', async () => {
    const response = await handelDataFetch(`/api/v2/nursery/store/template`, 'GET');
    return response.data;
});

//? NURSERY_STORE_TEMPLATES_DATA_BY_TAB_ID
export const nurseryStoreTemplatesGetAllByTabsIdAsync = createAsyncThunk('/nursery/store/template/getByTabId', async (id) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/byTabId/templates/${id}`, 'GET');
    return response.data;
});

//? NURSERY_STORE_TEMPLATES_DATA_CHANGE_RENDER_POSITION_BY_TAB_ID
/*
* Structures of data parameters
    data: { pre: index, next: index}
*/
export const nurseryStoreTemplatesChangeRenderPositionByTabsIdAsync = createAsyncThunk('/nursery/store/template/change/render/position', async ({ id, data }) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/byTabId/templates/${id}`, 'PATCH', data);
    return response.data;
});

//? NURSERY_STORE_TEMPLATES_DATA_CHANGE_RENDER_POSITION_BY_TAB_ID
/*
* Structures of data parameters
    data: { pre: index, next: index}
*/
export const deleteNurseryStoreTemplatesAsync = createAsyncThunk('/nursery/store/template/delete', async (id) => {
    console.log(id);

    const response = await handelDataFetch(`/api/v2/nursery/store/template/${id}`, 'DELETE');
    return response.data;
});


//? NURSERY_STORE_BLOCKS_DATA
//TODO: REVIEW THIS ACTIONS...
export const nurseryStoreBlocksGetAllAsync = createAsyncThunk('/nursery/store/block', async () => {
    const response = await handelDataFetch(`/api/v2/nursery/store/block`, 'GET');
    return response.data;
});


//? NURSERY_STORE_BLOCK_DATA_BY_TAB_ID
export const nurseryStoreBlockGetAllByTabIdAsync = createAsyncThunk('/nursery/store/block/getByTabId', async (id) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/byTabId/block/${id}`, 'GET');
    return response.data;
});

//? NURSERY_ADD_STORE_BLOCK
export const nurseryStoreBlockAddAsync = createAsyncThunk('/nursery/store/block/add', async (data) => {
    const response = await handelFetchDataWithImages("/api/v2/nursery/store/block", "POST", data);
    return response.data;
});

//? NURSERY_UPDATE_STORE_BLOCK
export const nurseryStoreBlockUpdateAsync = createAsyncThunk('/nursery/store/block/update', async ({ id, data }) => {
    const response = await handelFetchDataWithImages(`/api/v2/nursery/store/block/${id}`, 'PATCH', data);
    return response.data;
});

//? NURSERY_DELETE_STORE_BLOCK
export const nurseryStoreBlockDeleteAsync = createAsyncThunk('/nursery/store/block/delete', async (id) => {
    const response = await handelDataFetch(`/api/v2/nursery/store/block/${id}`, 'DELETE');
    return response.data;
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
                state.error = action.error;

            }).addCase(addNewTabSectionAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_ADD_NEW_TAB_SECTION

                state.isLoading = true;
                state.error = null;

            }).addCase(addNewTabSectionAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_ADD_NEW_TAB_SECTION

                state.isLoading = false;
                state.isCurrentTab = action.payload.result._id;
                state.nurseryStoreTabs = state.nurseryStoreTabs.concat(action.payload.result);
                state.error = null;

            }).addCase(addNewTabSectionAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_ADD_NEW_TAB_SECTION

                state.isLoading = false;
                state.error = action.error;

            })
            // .addCase(deleteTabSectionAsync.pending, (state) => {
            //     //^ PENDING: NURSERY_STORE_DELETE_TAB_SECTION

            //     state.isLoading = true;
            //     state.error = null;

            //     message.loading("Please wait we are deleting...");

            // }).addCase(deleteTabSectionAsync.fulfilled, (state, action) => {
            //     //* FULFILLED: NURSERY_STORE_DELETE_TAB_SECTION

            //     state.isLoading = false;
            //     state.isCurrentTab = initialState.isCurrentTab;

            //     //? DELETING THE SECTION DATA FROM THE NURSERY_STORE
            //     const index = state.nurseryStore.findIndex(tab => tab._id === action.payload.result._id);
            //     state.nurseryStore.splice(index, 1);
            //     state.error = null;

            //     message.success(action.payload.message);

            // }).addCase(deleteTabSectionAsync.rejected, (state, action) => {
            //     //! REJECTED: NURSERY_STORE_DELETE_TAB_SECTION

            //     state.isLoading = false;
            //     state.error = action.error;


            //     message.error(action.error.message);
            // })
            .addCase(nurseryStoreImagesUpload.pending, (state) => {
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
                state.error = action.error;

            })

            //* Added new API for nursery store data....


            //? NURSERY_STORE_TABS_GET
            .addCase(nurseryStoreTabsGetAllAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

            }).addCase(nurseryStoreTabsGetAllAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.nurseryStoreTabs = action.payload.result;
                state.error = null;

            }).addCase(nurseryStoreTabsGetAllAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

            })


            //? NURSERY_STORE_TABS
            .addCase(nurseryStoreTabDeleteAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

                message.loading("Please wait..., we are deleting the tab from store...")

            }).addCase(nurseryStoreTabDeleteAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = null;

                const nurseryStoreTabs = state.nurseryStoreTabs;
                const nurseryStoreTabsSetData = new ObjectArraySet();
                nurseryStoreTabsSetData.addBulk(nurseryStoreTabs);
                nurseryStoreTabsSetData.delete(action.payload.result._id);

                state.nurseryStoreTabs = nurseryStoreTabsSetData.items;

                //? Filter the template store data and remove the template for the deleted tab
                state.nurseryStoreTemplates = state.nurseryStoreTemplates.filter(d => d.nurseryStoreTabs !== action.payload.result._id);

                //? Filter the block store data and remove the block for the deleted tab
                state.nurseryStoreBlocks = state.nurseryStoreBlocks.filter(d => d.nurseryStoreTabs !== action.payload.result._id);

                state.isCurrentTab = 'info'; //? set back to the default state to view the nursery store information

                message.success("We have deleted the tab from store...")

            }).addCase(nurseryStoreTabDeleteAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error);
            })


            //? NURSERY_STORE_TABS
            .addCase(nurseryStoreTabEditAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

                message.loading("Please wait..., we are updating the tab from store...")

            }).addCase(nurseryStoreTabEditAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = null;

                const nurseryStoreTabs = state.nurseryStoreTabs;
                const nurseryStoreTabsSetData = new ObjectArraySet();
                nurseryStoreTabsSetData.addBulk(nurseryStoreTabs);
                nurseryStoreTabsSetData.add(action.payload.result);

                state.nurseryStoreTabs = nurseryStoreTabsSetData.items;

                message.success("We have updated the tab from store...")

            }).addCase(nurseryStoreTabEditAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error);
            })

            //? NURSERY_STORE_TEMPLATES
            .addCase(AddNurseryStoreTemplatesAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

            }).addCase(AddNurseryStoreTemplatesAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;



                const nurseryStoreTemplates = state.nurseryStoreTemplates;
                const nurseryStoreTemplatesSetData = new ObjectArraySet();
                nurseryStoreTemplatesSetData.addBulk(nurseryStoreTemplates);

                //* GET THE INDEX OF NEW TEMPLATES...
                const index = action.payload.result.index;

                //* FIND THE TEMPLATE WITH THE INDEX....
                const templateIndex = nurseryStoreTemplatesSetData.items.findIndex(template => template.index === index);

                //* IF THE TEMPLATE FOUND, UPDATE THE INDEX...
                if (templateIndex != -1) {
                    nurseryStoreTemplatesSetData.items = nurseryStoreTemplatesSetData.items.map(template => {
                        if (template.index >= index) {
                            template.index += 1;
                        }


                        return template;
                    })
                }
                //* ADD THE TEMPLATE TO THE AFTER CHECKING THE INCRIMINATION OF THE INDEX OR IF THE INDEX IS NOT PRESENT...
                nurseryStoreTemplatesSetData.add(action.payload.result);

                //* UPDATE THE STORE....
                state.nurseryStoreTemplates = nurseryStoreTemplatesSetData.items;

                state.error = null;

            }).addCase(AddNurseryStoreTemplatesAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

            })


            .addCase(nurseryStoreTemplatesChangeRenderPositionByTabsIdAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

            }).addCase(nurseryStoreTemplatesChangeRenderPositionByTabsIdAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = null;

                const nurseryStoreTemplates = state.nurseryStoreTemplates;
                const nurseryStoreTemplatesSetData = new ObjectArraySet();
                nurseryStoreTemplatesSetData.addBulk(nurseryStoreTemplates);

                nurseryStoreTemplatesSetData.add(action.payload.result.updatePreData);
                nurseryStoreTemplatesSetData.add(action.payload.result.updateNextData);

                state.nurseryStoreTemplates = nurseryStoreTemplatesSetData.items;

            }).addCase(nurseryStoreTemplatesChangeRenderPositionByTabsIdAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

            })


            .addCase(nurseryStoreTemplatesGetAllAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

            }).addCase(nurseryStoreTemplatesGetAllAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                // state.nurseryStoreTemplates = action.payload.result;

                state.error = null;

            }).addCase(nurseryStoreTemplatesGetAllAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

            })

            .addCase(nurseryStoreTemplatesGetAllByTabsIdAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

            }).addCase(nurseryStoreTemplatesGetAllByTabsIdAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = null;

                const nurseryStoreTemplates = state.nurseryStoreTemplates;
                const nurseryStoreTemplatesSetData = new ObjectArraySet();
                nurseryStoreTemplatesSetData.addBulk(nurseryStoreTemplates);
                nurseryStoreTemplatesSetData.addBulk(action.payload.result);

                state.nurseryStoreTemplates = nurseryStoreTemplatesSetData.items;

            }).addCase(nurseryStoreTemplatesGetAllByTabsIdAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

            })

            .addCase(deleteNurseryStoreTemplatesAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

                message.loading("Please wait..., we are deleting the templates...");

            }).addCase(deleteNurseryStoreTemplatesAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = null;

                const nurseryStoreTemplates = state.nurseryStoreTemplates;
                const nurseryStoreTemplatesSetData = new ObjectArraySet();
                nurseryStoreTemplatesSetData.addBulk(nurseryStoreTemplates);


                const deletedTemplate = nurseryStoreTemplatesSetData.get(action.payload.result._id);
                nurseryStoreTemplatesSetData.delete(action.payload.result._id);

                //? FILTER THE BLOCKS FOR THE DELETED TEMPLATE...
                state.nurseryStoreBlocks = state.nurseryStoreBlocks.filter(d => d.nurseryStoreTemplates  !== action.payload.result._id);

                //? UPDATE THE INDEX FOR AFTER DELETING THE EXISTING TEMPLATE....
                nurseryStoreTemplatesSetData.items = nurseryStoreTemplatesSetData.items.map(template => {
                    if (template.nurseryStoreTabs === deletedTemplate.nurseryStoreTabs && template.index > deletedTemplate.index) {
                        template.index -= 1;
                    }
                    return template;
                });

                state.nurseryStoreTemplates = nurseryStoreTemplatesSetData.items;

                message.success("We have deleted the template successfully...")

            }).addCase(deleteNurseryStoreTemplatesAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error);
            })

            //? NURSERY_STORE_BLOCK
            .addCase(nurseryStoreBlockAddAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

                message.loading("Please Wait..., We are Adding Contents...")

            }).addCase(nurseryStoreBlockAddAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;

                const nurseryStoreBlocks = state.nurseryStoreBlocks;
                const nurseryStoreBlocksSetData = new ObjectArraySet();
                nurseryStoreBlocksSetData.addBulk(nurseryStoreBlocks);
                nurseryStoreBlocksSetData.add(action.payload.result);

                state.nurseryStoreBlocks = nurseryStoreBlocksSetData.items;

                state.error = null;

                message.success("We have added content successfully...")
            }).addCase(nurseryStoreBlockAddAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error)
            })


            .addCase(nurseryStoreBlockUpdateAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

                message.loading("Please Wait..., We are Updating Contents...")

            }).addCase(nurseryStoreBlockUpdateAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;

                const nurseryStoreBlocks = state.nurseryStoreBlocks;
                const nurseryStoreBlocksSetData = new ObjectArraySet();
                nurseryStoreBlocksSetData.addBulk(nurseryStoreBlocks);
                nurseryStoreBlocksSetData.add(action.payload.result);

                state.nurseryStoreBlocks = nurseryStoreBlocksSetData.items;

                state.error = null;

                message.success("We have updated content successfully...")
            }).addCase(nurseryStoreBlockUpdateAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error)
            })
            .addCase(nurseryStoreBlockDeleteAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

                message.loading("Please Wait..., We are Deleting Contents...")

            }).addCase(nurseryStoreBlockDeleteAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;

                const nurseryStoreBlocks = state.nurseryStoreBlocks;
                const nurseryStoreBlocksSetData = new ObjectArraySet();
                nurseryStoreBlocksSetData.addBulk(nurseryStoreBlocks);
                nurseryStoreBlocksSetData.delete(action.payload.result._id);

                state.nurseryStoreBlocks = nurseryStoreBlocksSetData.items;

                state.error = null;

                message.success("We have Deleted content successfully...")
            }).addCase(nurseryStoreBlockDeleteAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error)
            })


            .addCase(nurseryStoreBlocksGetAllAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

            }).addCase(nurseryStoreBlocksGetAllAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                // state.nurseryStoreBlocks = action.payload.result;
                // console.log(action.payload.result)
                state.error = null;

            }).addCase(nurseryStoreBlocksGetAllAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

            })


            .addCase(nurseryStoreBlockGetAllByTabIdAsync.pending, (state) => {
                //^ PENDING: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = true;
                state.error = null;

            }).addCase(nurseryStoreBlockGetAllByTabIdAsync.fulfilled, (state, action) => {
                //* FULFILLED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = null;

                const nurseryStoreBlocks = state.nurseryStoreBlocks;
                const nurseryStoreBlocksSetData = new ObjectArraySet();
                nurseryStoreBlocksSetData.addBulk(nurseryStoreBlocks);
                nurseryStoreBlocksSetData.addBulk(action.payload.result);

                state.nurseryStoreBlocks = nurseryStoreBlocksSetData.items;

            }).addCase(nurseryStoreBlockGetAllByTabIdAsync.rejected, (state, action) => {
                //! REJECTED: NURSERY_STORE_CHANGE_RENDER_POSITION

                state.isLoading = false;
                state.error = action.error;

            })
    }
});


export const { setIsCurrentTab } = nurserySlice.actions;
export default nurserySlice.reducer; 