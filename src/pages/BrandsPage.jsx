import { useCallback, useDebugValue, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  deleteBrand,
  fetchBrands,
  postBrand,
  updateBrand,
} from "../store/slices/brandsSlice";
import Lista from "../components/Lista";
import Form from "../components/Form";
import { useDispatch } from "react-redux";

export default function BrandsPage() {
  const { section } = useOutletContext();
  const dispatch = useDispatch();

  const getElementAction = useCallback(() => dispatch(fetchBrands()), []);
  const onSubmitAction = postBrand;
  const onDeleteAction = deleteBrand;
  const selector = useCallback((state) => state.brands.brands, []);

  const config = useMemo(
    () => ({
      getElementAction,
      onSubmitAction,
      onDeleteAction,
      selector,
    }),
    [getElementAction, onSubmitAction, onDeleteAction, selector]
  );

  const listFields = useMemo(() => ["nome"], []);
  const formFields = useMemo(
    () => [{ name: "nome", label: "Nome brand", type: "text" }],
    []
  );

  if (section === "list") {
    return (
      <Lista
        {...config}
        fields={listFields}
        urlUpdateAction="/brands"
        foreignKeys={undefined}
        canEdit={true}
        canDelete={true}
        pageName="brands"
        onUpdateAction={updateBrand}
        formFields={formFields}
      />
    );
  }

  if (section === "form") {
    return (
      <Form
        {...config}
        fields={formFields}
        title="Aggiungi un nuovo brand"
        successMessage="Brand creato con successo!"
      />
    );
  }

  return null;
}
