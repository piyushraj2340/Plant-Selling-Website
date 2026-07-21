import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export const useTableParams = (fetchAction, defaultSortField = 'createdAt') => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

    const tableParams = {
        pagination: {
            current: parseInt(searchParams.get('page')) || 1,
            pageSize: parseInt(searchParams.get('limit')) || 10,
        },
        search: searchParams.get('search') || '',
        sortField: searchParams.get('sortField') || defaultSortField,
        sortOrder: searchParams.get('sortOrder') || 'descend',
    };

    // Debounce search updates to the URL
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = searchParams.get('search') || '';
            if (localSearch !== currentSearch) {
                const newParams = new URLSearchParams(searchParams);
                if (localSearch) {
                    newParams.set('search', localSearch);
                } else {
                    newParams.delete('search');
                }
                // Reset to page 1 on new search
                newParams.set('page', '1');
                setSearchParams(newParams, { replace: true });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localSearch, searchParams, setSearchParams]);

    const fetchParams = useCallback(() => {
        const params = {
            page: tableParams.pagination.current,
            limit: tableParams.pagination.pageSize,
            search: tableParams.search,
            sortField: tableParams.sortField,
            sortOrder: tableParams.sortOrder
        };
        
        // Merge any other parameters from the URL
        searchParams.forEach((value, key) => {
            if (!params[key]) {
                params[key] = value;
            }
        });
        
        return params;
    }, [tableParams.pagination.current, tableParams.pagination.pageSize, tableParams.search, tableParams.sortField, tableParams.sortOrder, searchParams]);

    // Dispatch the fetch action whenever the URL parameters change
    useEffect(() => {
        dispatch(fetchAction(fetchParams()));
    }, [dispatch, fetchAction, fetchParams]);

    const handleTableChange = (pagination, filters, sorter) => {
        const newParams = new URLSearchParams(searchParams);
        
        newParams.set('page', pagination.current.toString());
        newParams.set('limit', pagination.pageSize.toString());
        
        if (sorter && sorter.field) {
            newParams.set('sortField', sorter.field);
            newParams.set('sortOrder', sorter.order || 'descend');
        } else {
            newParams.delete('sortField');
            newParams.delete('sortOrder');
        }

        if (filters) {
            Object.keys(filters).forEach(key => {
                if (filters[key] && filters[key].length > 0) {
                    newParams.set(key, filters[key].join(','));
                } else {
                    newParams.delete(key);
                }
            });
        }

        setSearchParams(newParams, { replace: true });
    };

    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
    };

    return {
        tableParams,
        localSearch,
        handleTableChange,
        handleSearchChange,
        searchParams,
        setSearchParams
    };
};
