import { usePdv } from "../pdv-context";
import { PdvOperationToolbar } from "./pdv-operation-toolbar";
import { isMode } from "../utils/is-mode";
import { PdvWorkMain } from "./pdv-work-main";
import { UtilityPage } from "../utility/utility-page";
export function PdvWorkView() {
  const {
    navigate,
    page,
    orders,
    message,
    setModal,
    pageTitle,
    dataFilter,
    setDataFilter,
    newClients,
  } = usePdv();
  return (
    <>
      <PdvOperationToolbar />
      {isMode(page) ? (
        <PdvWorkMain />
      ) : (
        <UtilityPage
          page={page}
          pageTitle={pageTitle}
          navigate={navigate}
          message={message}
          orders={orders}
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
          newClients={newClients}
          setModal={setModal}
        />
      )}
    </>
  );
}
