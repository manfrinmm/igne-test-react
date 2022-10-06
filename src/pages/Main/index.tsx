import Input from "../../components/forms/Input";
import styles from "./styles.module.css";

import { Scope, FormHandles } from "@unform/core";
import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";
import { Form } from "@unform/web";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

type IProductData = {
  indice: number;
  descricaoProduto: string;
  unidadeMedida: string;
  qtdeEstoque: string;
  valorUnitario: string;
  valorTotal: string;
};
interface IAttachmentsData extends FileList {
  index: number;
}

export default function Main() {
  const [products, setProducts] = useState<IProductData[]>([
    { indice: 1 } as IProductData,
  ]);
  const [attachments, setAttachments] = useState<File[]>([]);

  const formRef = useRef<FormHandles>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  // Falta revisar
  const handleAddProduct = useCallback(() => {
    setProducts((state) => [
      ...state,
      { indice: Math.random() } as IProductData,
    ]);
  }, []);

  // Falta revisar
  const handleRemoveProduct = useCallback((indice: number) => {
    setProducts((state) =>
      state.filter((product) => product.indice !== indice),
    );
  }, []);

  const filesChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    console.log(files);
    if (!files) return;

    setAttachments((state) => [...files, ...state]);
  }, []);

  function handleRemoveAttachment(position: number) {
    setAttachments((state) => state.filter((_, index) => index !== position));
  }

  async function handleViewAttachment(attachment: File) {
    const arrayBuffer = await attachment.arrayBuffer();

    const blob = new Blob([new Uint8Array(arrayBuffer)], {
      type: attachment.type,
    });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = `${attachment.name}`;

    link.click();
  }

  const calculateTotalAmount = useCallback((fieldRef: string) => {
    const quantity =
      formRef.current?.getFieldValue(`${fieldRef}.quantity`) || 0;
    const amount = formRef.current?.getFieldValue(`${fieldRef}.amount`) || 0;

    const priceFormatted = Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount * quantity);

    formRef.current?.setFieldValue(`${fieldRef}.total_amount`, priceFormatted);
  }, []);

  const handleSubmit = useCallback((data: any) => {
    console.log(data);
  }, []);

  return (
    <div className="App">
      <header className="flex justify-center">
        <h1 className="text-center">Cadastro Cliente / Produto</h1>

        <button type="submit" id="submitButton" form="forms" className="">
          Enviar
        </button>
      </header>

      <main className="">
        <fieldset className={styles.session}>
          <legend>A Solicitante</legend>

          <div className="flex  w-full space-x-4">
            <Input
              type="datetime-local"
              name="solicitation_date"
              label="Data Solicitação"
              className="h-[34px]"
              containerClass="w-[50%]"
            />

            <Input label="Nome" name="name" />

            <Input label="Área" name="area" containerClass="w-[50%]" />
          </div>
        </fieldset>

        <fieldset className={`${styles.session} space-y-4 mt-2`}>
          <legend className="fs-color-white">Solicitação</legend>

          <fieldset className={`${styles.session} m-2`}>
            <legend className="fs-color-white">Dados do Fornecedor</legend>

            <Form
              className="row"
              id="forms"
              role="form"
              autoComplete="off"
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <div className="grid  grid-cols-3 gap-4 ">
                <Input
                  label="Razão Social"
                  name="razao_social"
                  containerClass="col-span-2"
                  required
                />
                <Input label="CNPJ" name="cnpj" required />

                <Input
                  label="Nome Fantasia"
                  name="fantasy_name"
                  containerClass="col-span-2"
                  required
                />

                <Input
                  label="Inscrição Estadual"
                  name="inscricao_estadual"
                  required
                />

                <Input label="CEP" name="address-zip_code" required />

                <Input
                  label="Inscrição Municipal"
                  name="inscricao_municipal"
                  containerClass="col-start-3"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <Input label="Endereço" name="address-street" required />
                <Input label="Complemento" name="address-complement" required />
                <Input label="Número" name="address-number" required />
                <Input label="Bairro" name="address-neighborhood" required />
                <Input label="Estado" name="address-state" required />
                <Input label="Município" name="address-city" required />
                <Input
                  label="Nome da pessoa de Contato"
                  name="contact-name"
                  required
                />
                <Input label="Telefone" name="contact-phone" required />
                <Input
                  label="E-mail"
                  name="contact-email"
                  type="email"
                  required
                />
              </div>
            </Form>
          </fieldset>

          <fieldset className={styles.session}>
            <legend>Produtos</legend>

            <button className="ml-auto" onClick={handleAddProduct}>
              Incluir Item
            </button>

            <ul className={styles.products} id="products">
              {products.map((product, index) => (
                // <Scope key={index} path={`products[${index}]`}>
                <li key={index} className={styles.product} id="item-1">
                  {products.length > 1 && (
                    <button
                      onClick={() => {
                        handleRemoveProduct(product.indice);
                      }}
                      className="mr-4 p-2"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  )}

                  <fieldset>
                    <legend>Item {index + 1}</legend>

                    <section className="flex flex-col">
                      {/* <input type="hidden" name="position" value="1" /> */}

                      <Input
                        label="Descrição do Produto"
                        name="description"
                        containerClass="flex-row items-center"
                        className="mt-0 ml-2"
                        required
                      />

                      <div className="flex justify-around mt-4">
                        <Input
                          label="Und. Medida"
                          name="measurement"
                          list="product-measurement-list"
                          required
                        />

                        <Input
                          label="Qtde em Estoque"
                          type="number"
                          name="quantity"
                          required
                          onChange={() => {
                            calculateTotalAmount(`products[${index}]`);
                          }}
                        />

                        <Input
                          label="Valor Unitário"
                          name="amount"
                          required
                          onChange={() => {
                            calculateTotalAmount(`products[${index}]`);
                          }}
                        />

                        <Input
                          label="Valor Total"
                          name="total_amount"
                          disabled
                        />
                      </div>
                    </section>
                  </fieldset>
                </li>
              ))}
            </ul>

            <datalist id="product-measurement-list">
              <option value="Quilograma"></option>
              <option value="Grama"></option>
              <option value="Litros"></option>
              <option value="Mililitros"></option>
              <option value="Quilômetros"></option>
              <option value="Metros"></option>
            </datalist>
          </fieldset>

          <fieldset className={`${styles.session} flex-row`}>
            <legend className="fs-color-white">Anexos</legend>

            <button
              className="self-baseline mr-4"
              onClick={() => {
                inputFileRef.current?.click();
              }}
            >
              Anexar
            </button>

            <input
              type="file"
              name="inputFile"
              id="inputFile"
              multiple
              required
              ref={inputFileRef}
              onChange={filesChange}
              className="hidden"
            />

            {attachments.length > 0 && (
              <fieldset className={`${styles.session} w-full`}>
                <legend className="fs-color-white">Documentos</legend>

                <ul className={styles.attachments} id="attachments">
                  {attachments.map((attachment, index) => (
                    <li
                      key={Math.random()}
                      className="attachment flex items-center"
                    >
                      <button
                        className="text-red-500 hover:text-red-600 hover:border-red-600 border border-solid"
                        onClick={() => {
                          handleRemoveAttachment(index);
                        }}
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                      <button
                        className="mx-2 text-emerald-500 hover:text-emerald-600 hover:border-emerald-600"
                        onClick={() => {
                          handleViewAttachment(attachment);
                        }}
                      >
                        <EyeIcon className="w-3 h-3" />
                      </button>
                      <p className="ml-2">{attachment.name}</p>
                    </li>
                  ))}
                </ul>
              </fieldset>
            )}
          </fieldset>
        </fieldset>
      </main>
    </div>
  );
}
