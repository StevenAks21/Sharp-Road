import Navbar from "../Components/Navbar";
import { useEffect, useMemo, useState, useContext } from "react";
import { languageContext } from "../Contexts";
import Style from "../Style/Inventory.module.css";

import { GetAll } from "../Services/Inventory/GetAll";
import { NewItem } from "../Services/Inventory/NewItem";
import { GetById } from "../Services/Inventory/GetById";
import { DeleteById } from "../Services/Inventory/DeleteById";
import { UpdateStock } from "../Services/Inventory/UpdateStock";

const TEXT = {
  English: {
    PageTitle: "SharpRoad - Inventory Page",
    Tabs: {
      All: "Get All Items",
      Add: "Add New Item",
      Get: "Get Item By ID",
      Update: "Update Stock",
      Delete: "Delete Item",
    },
    Loading: "Loading...",
    SomethingWentWrong: "Something went wrong",
    InvalidId: "Please enter a valid item ID",
    InvalidName: "Please enter a valid item name",
    InvalidStock: "Please enter a valid stock number",
    NoItemFound: "No items found",
    ItemNotFound: "Item not found",
    Titles: {
      All: "Inventory",
      Add: "Add Item",
      Get: "Find Item",
      Update: "Update Stock",
      Delete: "Delete Item",
    },
    Labels: {
      Id: "ID",
      Name: "Name",
      Stock: "Stock",
    },
    Inputs: {
      AddName: "Enter item name",
      AddStock: "Enter initial stock (optional)",
      GetId: "Enter item ID",
      UpdateId: "Enter item ID",
      UpdateStock: "Enter new stock",
      DeleteId: "Enter item ID",
    },
    Buttons: {
      Submit: "Submit",
      GetItem: "Get Item",
      Update: "Update",
      Delete: "Delete",
      Refresh: "Refresh",
    },
    Messages: {
      Added: (name) => `Item added successfully: ${name}`,
      AddFailed: (reason) =>
        `Failed to add item. ${reason ? `Reason: ${reason}` : ""}`.trim(),

      Updated: (id) => `Stock updated successfully. ID: ${id}`,
      UpdateFailed: (reason) =>
        `Failed to update stock. ${reason ? `Reason: ${reason}` : ""}`.trim(),

      Deleted: (id) => `Item deleted successfully. ID: ${id}`,
      DeleteFailed: (reason) =>
        `Failed to delete item. ${reason ? `Reason: ${reason}` : ""}`.trim(),
    },
  },
  Indonesian: {
    PageTitle: "SharpRoad - Halaman Inventori",
    Tabs: {
      All: "Tampilkan Semua Item",
      Add: "Tambah Item Baru",
      Get: "Cari Item Berdasarkan ID",
      Update: "Ubah Stok",
      Delete: "Hapus Item",
    },
    Loading: "Memuat...",
    SomethingWentWrong: "Terjadi kesalahan",
    InvalidId: "Masukkan ID item yang valid",
    InvalidName: "Masukkan nama item yang valid",
    InvalidStock: "Masukkan angka stok yang valid",
    NoItemFound: "Tidak ada item",
    ItemNotFound: "Item tidak ditemukan",
    Titles: {
      All: "Inventori",
      Add: "Tambah Item",
      Get: "Cari Item",
      Update: "Ubah Stok",
      Delete: "Hapus Item",
    },
    Labels: {
      Id: "ID",
      Name: "Nama",
      Stock: "Stok",
    },
    Inputs: {
      AddName: "Masukkan nama item",
      AddStock: "Masukkan stok awal (opsional)",
      GetId: "Masukkan ID item",
      UpdateId: "Masukkan ID item",
      UpdateStock: "Masukkan stok baru",
      DeleteId: "Masukkan ID item",
    },
    Buttons: {
      Submit: "Kirim",
      GetItem: "Tampilkan Item",
      Update: "Ubah",
      Delete: "Hapus",
      Refresh: "Muat Ulang",
    },
    Messages: {
      Added: (name) => `Item berhasil ditambahkan: ${name}`,
      AddFailed: (reason) =>
        `Gagal menambahkan item. ${reason ? `Alasan: ${reason}` : ""}`.trim(),

      Updated: (id) => `Stok berhasil diubah. ID: ${id}`,
      UpdateFailed: (reason) =>
        `Gagal mengubah stok. ${reason ? `Alasan: ${reason}` : ""}`.trim(),

      Deleted: (id) => `Item berhasil dihapus. ID: ${id}`,
      DeleteFailed: (reason) =>
        `Gagal menghapus item. ${reason ? `Alasan: ${reason}` : ""}`.trim(),
    },
  },
};

const VIEWS = {
  ALL: "all",
  ADD: "add",
  GET: "get",
  UPDATE: "update",
  DELETE: "delete",
};

function Field({
  label,
  value,
  placeholder,
  onChange,
  disabled = false,
  type = "text",
}) {
  return (
    <div className={Style.field}>
      <label className={Style.label}>{label}</label>
      <input
        className={Style.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        type={type}
      />
    </div>
  );
}

function StatRow({ label, value, mono = false }) {
  return (
    <div className={Style.employeeRow}>
      <span className={Style.employeeKey}>{label}</span>
      <span className={`${Style.employeeVal} ${mono ? Style.mono : ""}`}>
        {value}
      </span>
    </div>
  );
}

function ItemCard({ item, text, variant = "list" }) {
  const stockVal = Number(item?.stock ?? 0);
  const safeStock = Number.isFinite(stockVal) ? stockVal : 0;

  return (
    <div
      className={`${Style.employeeCard} ${
        variant === "result" ? Style.resultCard : ""
      }`}
    >
      <div className={Style.employeeHeader}>
        <div className={Style.employeeIdentity}>
          <div className={Style.employeeName}>{item?.name ?? "-"}</div>
          <div className={Style.employeeMeta}>
            {text.Labels.Id}:{" "}
            <span className={Style.mono}>{item?.id ?? "-"}</span>
          </div>
        </div>

        <div className={Style.employeePill} title={text.Labels.Stock}>
          <span className={Style.pillLabel}>{text.Labels.Stock}</span>
          <span className={Style.mono}>{safeStock}</span>
        </div>
      </div>

      <div className={Style.employeeDivider} />

      <div className={Style.employeeRows}>
        <StatRow
          label={text.Labels.Name}
          value={item?.name ?? "-"}
        />
        <StatRow
          label={text.Labels.Stock}
          value={String(safeStock)}
          mono
        />
      </div>
    </div>
  );
}

function Inventory() {
  const [language] = useContext(languageContext);
  const text = useMemo(() => TEXT[language ?? "English"], [language]);

  const [view, setView] = useState(VIEWS.ALL);

  const [items, setItems] = useState([]);
  const [fetchedItem, setFetchedItem] = useState(null);

  const [addName, setAddName] = useState("");
  const [addStock, setAddStock] = useState("");

  const [getId, setGetId] = useState("");

  const [updateId, setUpdateId] = useState("");
  const [updateStock, setUpdateStock] = useState("");

  const [deleteId, setDeleteId] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const [hasFetchedAll, setHasFetchedAll] = useState(false);
  const [hasSearchedById, setHasSearchedById] = useState(false);

  useEffect(() => {
    document.title = text.PageTitle;
  }, [text.PageTitle]);

  const resetFeedback = () => {
    setErrorMessage("");
    setMessage("");
  };

  const setActiveView = (nextView) => {
    setView(nextView);
    resetFeedback();

    if (nextView === VIEWS.GET) {
      setFetchedItem(null);
      setGetId("");
      setHasSearchedById(false);
    }

    if (nextView === VIEWS.ADD) {
      setAddName("");
      setAddStock("");
    }

    if (nextView === VIEWS.UPDATE) {
      setUpdateId("");
      setUpdateStock("");
    }

    if (nextView === VIEWS.DELETE) {
      setDeleteId("");
    }
  };

  const run = async (fn) => {
    try {
      setLoading(true);
      resetFeedback();
      await fn();
    } catch (err) {
      setErrorMessage(err?.message ?? text.SomethingWentWrong);
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = async () => {
    await run(async () => {
      const data = await GetAll();
      const list = data?.result;

      setItems(Array.isArray(list) ? list : []);
      setHasFetchedAll(true);
      setView(VIEWS.ALL);
    });
  };

  const handleAdd = async () => {
    const name = addName.trim();
    if (!name) {
      setErrorMessage(text.InvalidName);
      setMessage(text.Messages.AddFailed(text.InvalidName));
      return;
    }

    let stockNum = 0;
    if (addStock.trim() !== "") {
      stockNum = Number(addStock);
      if (!Number.isFinite(stockNum)) {
        setErrorMessage(text.InvalidStock);
        setMessage(text.Messages.AddFailed(text.InvalidStock));
        return;
      }
    }

    try {
      setLoading(true);
      resetFeedback();

      const data = await NewItem(name, stockNum);

      if (data?.error) {
        const reason = data?.message ?? text.SomethingWentWrong;
        setErrorMessage(reason);
        setMessage(text.Messages.AddFailed(reason));
        return;
      }

      setMessage(data?.message ?? text.Messages.Added(name));
      setAddName("");
      setAddStock("");
    } catch (err) {
      const reason = err?.message ?? text.SomethingWentWrong;
      setErrorMessage(reason);
      setMessage(text.Messages.AddFailed(reason));
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async () => {
    const id = getId.trim();
    if (!id) {
      setErrorMessage(text.InvalidId);
      setFetchedItem(null);
      setHasSearchedById(false);
      return;
    }

    await run(async () => {
      const data = await GetById(id);
      const item = data?.result ?? data;

      setFetchedItem(item && item.id ? item : null);
      setMessage(data?.message ?? "");
      setHasSearchedById(true);
    });
  };

  const handleUpdate = async () => {
    const id = updateId.trim();
    if (!id) {
      setErrorMessage(text.InvalidId);
      setMessage(text.Messages.UpdateFailed(text.InvalidId));
      return;
    }

    const stockNum = Number(updateStock);
    if (!Number.isFinite(stockNum)) {
      setErrorMessage(text.InvalidStock);
      setMessage(text.Messages.UpdateFailed(text.InvalidStock));
      return;
    }

    try {
      setLoading(true);
      resetFeedback();

      const data = await UpdateStock(id, stockNum);

      if (data?.error) {
        const reason = data?.message ?? text.SomethingWentWrong;
        setErrorMessage(reason);
        setMessage(text.Messages.UpdateFailed(reason));
        return;
      }

      setMessage(data?.message ?? text.Messages.Updated(id));
      setUpdateStock("");
    } catch (err) {
      const reason = err?.message ?? text.SomethingWentWrong;
      setErrorMessage(reason);
      setMessage(text.Messages.UpdateFailed(reason));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const id = deleteId.trim();
    if (!id) {
      setErrorMessage(text.InvalidId);
      setMessage(text.Messages.DeleteFailed(text.InvalidId));
      return;
    }

    try {
      setLoading(true);
      resetFeedback();

      const data = await DeleteById(id);

      if (data?.error) {
        const reason = data?.message ?? text.SomethingWentWrong;
        setErrorMessage(reason);
        setMessage(text.Messages.DeleteFailed(reason));
        return;
      }

      setMessage(data?.message ?? text.Messages.Deleted(id));
      setDeleteId("");
    } catch (err) {
      const reason = err?.message ?? text.SomethingWentWrong;
      setErrorMessage(reason);
      setMessage(text.Messages.DeleteFailed(reason));
    } finally {
      setLoading(false);
    }
  };

  const title = (() => {
    if (view === VIEWS.ADD) return text.Titles.Add;
    if (view === VIEWS.GET) return text.Titles.Get;
    if (view === VIEWS.UPDATE) return text.Titles.Update;
    if (view === VIEWS.DELETE) return text.Titles.Delete;
    return text.Titles.All;
  })();

  return (
    <div>
      <Navbar />

      <div className={Style.container}>
        <div className={Style.header}>
          <h1 className={Style.title}>{title}</h1>
          <p className={Style.subtitle}>{text.PageTitle}</p>
        </div>

        <div className={Style.buttonRow}>
          <button
            className={`${Style.button} ${
              view === VIEWS.ALL ? Style.activeButton : ""
            }`}
            onClick={fetchAll}
            disabled={loading}
          >
            {text.Tabs.All}
          </button>

          <button
            className={`${Style.button} ${
              view === VIEWS.ADD ? Style.activeButton : ""
            }`}
            onClick={() => setActiveView(VIEWS.ADD)}
            disabled={loading}
          >
            {text.Tabs.Add}
          </button>

          <button
            className={`${Style.button} ${
              view === VIEWS.GET ? Style.activeButton : ""
            }`}
            onClick={() => setActiveView(VIEWS.GET)}
            disabled={loading}
          >
            {text.Tabs.Get}
          </button>

          <button
            className={`${Style.button} ${
              view === VIEWS.UPDATE ? Style.activeButton : ""
            }`}
            onClick={() => setActiveView(VIEWS.UPDATE)}
            disabled={loading}
          >
            {text.Tabs.Update}
          </button>

          <button
            className={`${Style.button} ${
              view === VIEWS.DELETE ? Style.activeButton : ""
            }`}
            onClick={() => setActiveView(VIEWS.DELETE)}
            disabled={loading}
          >
            {text.Tabs.Delete}
          </button>
        </div>

        {loading && <p className={Style.subtext}>{text.Loading}</p>}
        {errorMessage && <p className={Style.error}>{errorMessage}</p>}
        {message && !errorMessage && <p className={Style.success}>{message}</p>}
        {message && errorMessage && <p className={Style.error}>{message}</p>}

        {view === VIEWS.ALL && (
          <div className={Style.content}>
            <div className={Style.toolbar}>
              <button
                className={Style.secondaryButton}
                onClick={fetchAll}
                disabled={loading}
              >
                {text.Buttons.Refresh}
              </button>

              <div className={Style.countPill}>
                <span className={Style.mono}>{items.length}</span>
                <span className={Style.countLabel}>{text.Titles.All}</span>
              </div>
            </div>

            {hasFetchedAll && !loading && !errorMessage && items.length === 0 && (
              <div className={Style.helperCard}>
                <p>{text.NoItemFound}</p>
              </div>
            )}

            {!loading && !errorMessage && items.length > 0 && (
              <div className={Style.grid}>
                {items.map((it) => (
                  <ItemCard key={it.id} item={it} text={text} />
                ))}
              </div>
            )}
          </div>
        )}

        {view === VIEWS.ADD && (
          <div className={Style.card}>
            <p className={Style.cardTitle}>{text.Titles.Add}</p>

            <Field
              label={text.Labels.Name}
              value={addName}
              placeholder={text.Inputs.AddName}
              onChange={(v) => {
                setAddName(v);
                resetFeedback();
              }}
              disabled={loading}
            />

            <Field
              label={text.Labels.Stock}
              value={addStock}
              placeholder={text.Inputs.AddStock}
              onChange={(v) => {
                setAddStock(v);
                resetFeedback();
              }}
              disabled={loading}
              type="number"
            />

            <button
              className={Style.primaryButton}
              onClick={handleAdd}
              disabled={loading || addName.trim().length === 0}
            >
              {text.Buttons.Submit}
            </button>
          </div>
        )}

        {view === VIEWS.GET && (
          <div className={Style.content}>
            <div className={Style.card}>
              <p className={Style.cardTitle}>{text.Titles.Get}</p>

              <Field
                label={text.Labels.Id}
                value={getId}
                placeholder={text.Inputs.GetId}
                onChange={(v) => {
                  setGetId(v);
                  setHasSearchedById(false);
                  setFetchedItem(null);
                  resetFeedback();
                }}
                disabled={loading}
              />

              <button
                className={Style.primaryButton}
                onClick={handleGetById}
                disabled={loading || getId.trim().length === 0}
              >
                {text.Buttons.GetItem}
              </button>
            </div>

            {!loading && !errorMessage && fetchedItem && (
              <ItemCard item={fetchedItem} text={text} variant="result" />
            )}

            {!loading && !errorMessage && hasSearchedById && !fetchedItem && (
              <div className={Style.helperCard}>
                <p>{text.ItemNotFound}</p>
              </div>
            )}
          </div>
        )}

        {view === VIEWS.UPDATE && (
          <div className={Style.card}>
            <p className={Style.cardTitle}>{text.Titles.Update}</p>

            <Field
              label={text.Labels.Id}
              value={updateId}
              placeholder={text.Inputs.UpdateId}
              onChange={(v) => {
                setUpdateId(v);
                resetFeedback();
              }}
              disabled={loading}
            />

            <Field
              label={text.Labels.Stock}
              value={updateStock}
              placeholder={text.Inputs.UpdateStock}
              onChange={(v) => {
                setUpdateStock(v);
                resetFeedback();
              }}
              disabled={loading}
              type="number"
            />

            <button
              className={Style.primaryButton}
              onClick={handleUpdate}
              disabled={
                loading ||
                updateId.trim().length === 0 ||
                updateStock.trim().length === 0
              }
            >
              {text.Buttons.Update}
            </button>
          </div>
        )}

        {view === VIEWS.DELETE && (
          <div className={Style.card}>
            <p className={Style.cardTitle}>{text.Titles.Delete}</p>

            <Field
              label={text.Labels.Id}
              value={deleteId}
              placeholder={text.Inputs.DeleteId}
              onChange={(v) => {
                setDeleteId(v);
                resetFeedback();
              }}
              disabled={loading}
            />

            <button
              className={Style.primaryButtonDanger}
              onClick={handleDelete}
              disabled={loading || deleteId.trim().length === 0}
            >
              {text.Buttons.Delete}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;