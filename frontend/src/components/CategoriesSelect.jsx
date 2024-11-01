import React, {useEffect, useState} from 'react';
import './Form.css';
import makeAnimated from "react-select/animated";
import Requests from "../API/requests";
import Select from "react-select";

function CategoriesSelect({selected_categories_list, setSelectedCategories_list, already_selected = [], multi = true, onChange = ()=>{}}) {
    const animatedComponents = makeAnimated();
    const [categories_list, setCategories_list] = useState(null);
    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '5px',
            color: 'white',
            backgroundColor: 'grey',
            maxWidth: '800px'
        }),
        option: (provided) => ({
            ...provided,
            borderRadius: '10px',
            background: 'grey'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'white',
        }),
        menuList: (provided) => ({
            ...provided,
            backgroundColor: 'grey',
        }),
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                Requests.categories_all().then((resp) => {
                    if (resp.state === true){
                        setCategories_list(
                            resp.data.map(item => ({ value: item.id, label: item.title }))
                        );
                    }
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    // function getCategoryIds() {
    //     return selected_categories_list.map(element => Number.parseInt(element.value));
    // }

    return (
        <>
            {categories_list &&
                <Select
                    styles={customStyles}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti = {multi}
                    placeholder={"Категорії"}
                    options={categories_list}
                    defaultValue={
                        already_selected === null ? [] :
                        already_selected.map((id) => categories_list.find((category) => category.value === id))
                    }
                    onChange={(selectedOptions) => {
                        localStorage.setItem('main-menu-categories', JSON.stringify(selectedOptions));
                        setSelectedCategories_list(selectedOptions);
                        onChange(selectedOptions);
                    }}
                />
            }
        </>

    );
}
export default CategoriesSelect;
