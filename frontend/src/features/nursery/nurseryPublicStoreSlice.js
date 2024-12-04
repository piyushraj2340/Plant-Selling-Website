import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handelDataFetch from "../../utils/handelDataFetch";
import { message } from "antd";
import ObjectArraySet from "../../utils/ObjectArraySet ";

const initialState = {
    nurseryPublicStoresDetails: [],
    nurseryPublicStoreTabs: [],
    nurseryPublicStoreTemplates: [],
    nurseryPublicStoreBlocks: [],
    error: null,
    isLoading: false,
}

/*

//? Sample api structure for public stores....

nurseryPublicStoresDetails: [
    {
        _id: "nursery_id",
        nurseryName: "Name",
        nurseryEmail: "email",
        nurseryPhone: "phone",
        address: "address",
        pinCode: "pinCode",
        city: "city",
        state: "state",
        avatar: {
            public_id: "public_id",
            url: "url"
        },
        cover: {
            public_id: "public_id",
            url: "url"
        },
    }
]

nurseryPublicStoreTabs: [
        {
            _id: "tab_id",
            tabName: "tab_name",
            status: "publish", // only publish
            index: 0 // render positions
        }
],


nurseryPublicStoreTemplates: [
    {
        _id: "template_id",
        nurseryStoreTabs: "tab_id",
        index: 0,
        templateName: "template_name"
    }
],


nurseryPublicStoreBlocks: [
    {
        isProduct: false,
        _id: "block_id",
        nurseryStoreTabs: "tab_id",
        nurseryStoreTemplates: "template_id",
        index: 0,
        url: "url",
        title: "title",
    }
]

*/

export const nurseryPublicStoreDetails = createAsyncThunk("/nursery/public/store/details/get", async (nurseryId) => {
    const response = await handelDataFetch(`/api/v2/public/nursery/details/${nurseryId}`, 'GET');
    return response.data;
})

export const nurseryPublicStoreGetPublishTabs = createAsyncThunk("/nursery/public/store/tabs/get", async (nurseryId) => {
    const response = await handelDataFetch(`/api/v2/public/nursery/store/view/${nurseryId}/getAllTabs`, 'GET');
    return response.data;
});

export const nurseryPublicStoreGetPublishTemplates = createAsyncThunk("/nursery/public/store/templates/get", async ({nurseryId, nurseryTabId}) => {
    const response = await handelDataFetch(`/api/v2/public/nursery/store/view/${nurseryId}/getAllTemplates/${nurseryTabId}`, 'GET');
    return response.data;
});

export const nurseryPublicStoreGetPublishBlocks = createAsyncThunk("/nursery/public/store/blocks/get", async ({nurseryId, nurseryTabId}) => {
    
    const response = await handelDataFetch(`/api/v2/public/nursery/store/view/${nurseryId}/getAllBlocks/${nurseryTabId}`, 'GET');
    return response.data;
});

export const nurseryPublicStoreSlice = createSlice({
    name: 'nurseryPublicStore',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            //? Details

            .addCase(nurseryPublicStoreDetails.pending, (state) => {
                //^ PENDING: NURSERY_DETAILS

                state.isLoading = true;
                state.error = null;

            })
            .addCase(nurseryPublicStoreDetails.fulfilled, (state, action) => {
                //* SUCCESS: NURSERY_DETAILS

                state.isLoading = false;
                state.error = null;

                //* Taking the backup of existing data....
                const nurseryPublicStoresBackup = state.nurseryPublicStoresDetails;

                //* Creating the array set of objects
                const nurseryPublicStoreNew = new ObjectArraySet();

                //* Insert the backup data into the set...
                nurseryPublicStoreNew.addBulk(nurseryPublicStoresBackup);

                //* insert the new data into the
                nurseryPublicStoreNew.add(action.payload.result);

                state.nurseryPublicStoresDetails = nurseryPublicStoreNew.items;

            })
            .addCase(nurseryPublicStoreDetails.rejected, (state, action) => {
                //! REJECTED: NURSERY_DETAILS

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);

            })


            //? Tabs

            .addCase(nurseryPublicStoreGetPublishTabs.pending, (state) => {
                //^ PENDING: NURSERY_DETAILS

                state.isLoading = true;
                state.error = null;

            })
            .addCase(nurseryPublicStoreGetPublishTabs.fulfilled, (state, action) => {
                //* SUCCESS: NURSERY_DETAILS

                state.isLoading = false;
                state.error = null;

                //* Taking the backup of existing data....
                const nurseryPublicStoresBackup = state.nurseryPublicStoreTabs;

                //* Creating the array set of objects
                const nurseryPublicStoreNew = new ObjectArraySet();

                //* Insert the backup data into the set...
                nurseryPublicStoreNew.addBulk(nurseryPublicStoresBackup);

                //* insert the new data into the
                nurseryPublicStoreNew.addBulk(action.payload.result);

                state.nurseryPublicStoreTabs = nurseryPublicStoreNew.items;

            })
            .addCase(nurseryPublicStoreGetPublishTabs.rejected, (state, action) => {
                //! REJECTED: NURSERY_DETAILS

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);

            })


            //? Templates

            .addCase(nurseryPublicStoreGetPublishTemplates.pending, (state) => {
                //^ PENDING: NURSERY_DETAILS

                state.isLoading = true;
                state.error = null;

            })
            .addCase(nurseryPublicStoreGetPublishTemplates.fulfilled, (state, action) => {
                //* SUCCESS: NURSERY_DETAILS

                state.isLoading = false;
                state.error = null;

                //* Taking the backup of existing data....
                const nurseryPublicStoresBackup = state.nurseryPublicStoreTemplates;

                //* Creating the array set of objects
                const nurseryPublicStoreNew = new ObjectArraySet();

                //* Insert the backup data into the set...
                nurseryPublicStoreNew.addBulk(nurseryPublicStoresBackup);

                //* insert the new data into the
                nurseryPublicStoreNew.addBulk(action.payload.result);

                state.nurseryPublicStoreTemplates = nurseryPublicStoreNew.items;

            })
            .addCase(nurseryPublicStoreGetPublishTemplates.rejected, (state, action) => {
                //! REJECTED: NURSERY_DETAILS

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);

            })


            //? Blocks

            .addCase(nurseryPublicStoreGetPublishBlocks.pending, (state) => {
                //^ PENDING: NURSERY_DETAILS

                state.isLoading = true;
                state.error = null;

            })
            .addCase(nurseryPublicStoreGetPublishBlocks.fulfilled, (state, action) => {
                //* SUCCESS: NURSERY_DETAILS

                state.isLoading = false;
                state.error = null;

                //* Taking the backup of existing data....
                const nurseryPublicStoresBackup = state.nurseryPublicStoreBlocks;

                //* Creating the array set of objects
                const nurseryPublicStoreNew = new ObjectArraySet();

                //* Insert the backup data into the set...
                nurseryPublicStoreNew.addBulk(nurseryPublicStoresBackup);

                //* insert the new data into the
                nurseryPublicStoreNew.addBulk(action.payload.result);

                state.nurseryPublicStoreBlocks = nurseryPublicStoreNew.items;

            })
            .addCase(nurseryPublicStoreGetPublishBlocks.rejected, (state, action) => {
                //! REJECTED: NURSERY_DETAILS

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);

            });
    }
});


export default nurseryPublicStoreSlice.reducer;