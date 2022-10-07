import { ChangeEvent, useCallback, useRef, useState } from "react";

import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Scope, FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import Input from "../../components/forms/Input";
import readFileAsDataURL from "../../utils/readFileAsDataURL";
import styles from "./styles.module.css";

type IProductData = {
  id: number;
  description: string;
  measurement: string;
  quantity: number;
  amount: string;
  total_amount: string;
};

type IAttachmentData = {
  name: string;
  blobKey: string;
  blob: string;
};

export default function Main() {
  const [products, setProducts] = useState<IProductData[]>([
    { id: 1 } as IProductData,
  ]);
  const [attachments, setAttachments] = useState<IAttachmentData[]>([]);

  const formRef = useRef<FormHandles>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleAddProduct = useCallback(() => {
    const { products: productsForms } = formRef.current?.getData() as any;

    setProducts([
      ...productsForms,
      {
        id: Math.random(),
        description: "",
        measurement: "",
        quantity: 0,
        amount: "0",
        total_amount: "0",
      },
    ]);
  }, []);

  const handleRemoveProduct = useCallback((id: number) => {
    setProducts((state) => state.filter((product) => product.id !== id));
  }, []);
  const handleLoadZipCode = useCallback(async () => {
    const zipCode = formRef.current?.getFieldValue("address.zip_code") || 0;
    try {
      const data = await (
        await fetch(`https://viacep.com.br/ws/${zipCode}/json`)
      ).json();

      formRef.current?.setFieldValue("address.street", data.logradouro);
      formRef.current?.setFieldValue("address.neighborhood", data.bairro);
      formRef.current?.setFieldValue("address.state", data.uf);
      formRef.current?.setFieldValue("address.city", data.localidade);
    } catch (error) {
      alert("Falha ao carregar cep");
    }
  }, []);

  const filesChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      if (!files) return;

      // eslint-disable-next-line no-restricted-syntax
      for await (const file of files) {
        const data = await readFileAsDataURL(file);

        const blobKey = `igne-test:files:${Math.random()}`;

        sessionStorage.setItem(blobKey, data as string);
        setAttachments((state) => [
          { blobKey, blob: data as string, name: file.name },
          ...state,
        ]);
      }
    },
    [],
  );

  function handleRemoveAttachment(blobKey: string) {
    sessionStorage.removeItem(blobKey);

    setAttachments((state) =>
      state.filter((attachment) => attachment.blobKey !== blobKey),
    );
  }

  async function handleViewAttachment(attachment: IAttachmentData) {
    const link = document.createElement("a");

    link.href = attachment.blob;
    link.download = `${attachment.name}`;

    link.click();
  }

  const calculateTotalAmount = useCallback(async (fieldRef: string) => {
    const quantity =
      formRef.current?.getFieldValue(`${fieldRef}.quantity`) || 0;
    const amount = formRef.current?.getFieldValue(`${fieldRef}.amount`) || 0;

    const priceFormatted = Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount * quantity);

    formRef.current?.setFieldValue(`${fieldRef}.total_amount`, priceFormatted);
  }, []);

  const handleSubmit = useCallback(
    async (data: any) => {
      console.log(data);

      if (data.products.length < 1) {
        alert("Você deve adicionar ao menos um produto!");

        return;
      }

      if (attachments.length < 1) {
        alert("Você deve adicionar ao menos um anexo!");
        return;
      }

      const dataFormatted = {
        razaoSocial: data.razao_social,
        nomeFantasia: data.fantasy_name,
        cnpj: data.cnpj,
        inscricaoEstadual: data.inscricao_estadual,
        inscricaoMunicipal: data.inscricao_municipal,
        nomeContato: data.contact.name,
        telefoneContato: data.contact.phone,
        emailContato: data.contact.email,
        produtos: data.products.map((product: IProductData, index: number) => ({
          indice: index + 1,
          descricaoProduto: product.description,
          unidadeMedida: product.measurement,
          qtdeEstoque: product.quantity,
          valorUnitario: product.amount,
          valorTotal: product.total_amount,
        })),
        anexos: attachments.map((attachment, index) => ({
          indice: index + 1,
          nomeArquivo: attachment.name,
          blobArquivo: attachment.blob,
        })),
      };

      console.log(dataFormatted);
    },
    [attachments],
  );

  return (
    <div className="App">
      <header className="flex justify-center">
        <h1 className="text-center">Cadastro Cliente / Produto</h1>

        <button type="submit" id="submitButton" form="forms">
          Enviar
        </button>
      </header>

      <main className="">
        <Form id="forms" ref={formRef} onSubmit={handleSubmit}>
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

                <Scope path="address">
                  <Input
                    label="CEP"
                    name="zip_code"
                    onBlur={handleLoadZipCode}
                    required
                  />
                </Scope>

                <Input
                  label="Inscrição Municipal"
                  name="inscricao_municipal"
                  containerClass="col-start-3"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <Scope path="address">
                  <Input label="Endereço" name="street" required />
                  <Input label="Complemento" name="complement" required />
                  <Input label="Número" name="number" required />
                  <Input label="Bairro" name="neighborhood" required />
                  <Input label="Estado" name="state" required />
                  <Input label="Município" name="city" required />
                </Scope>

                <Scope path="contact">
                  <Input
                    label="Nome da pessoa de Contato"
                    name="name"
                    required
                  />
                  <Input label="Telefone" name="phone" required />
                  <Input label="E-mail" name="email" type="email" required />
                </Scope>
              </div>
            </fieldset>

            <fieldset className={styles.session}>
              <legend>Produtos</legend>

              <button
                type="button"
                className="ml-auto"
                onClick={handleAddProduct}
              >
                Incluir Item
              </button>

              <ul className={styles.products} id="products">
                {products.map((product, index) => (
                  <Scope key={product.id} path={`products[${index}]`}>
                    <li className={styles.product}>
                      {products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveProduct(product.id);
                          }}
                          className="mr-4 p-2"
                        >
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      )}

                      <fieldset>
                        <legend>Item {index + 1}</legend>

                        <section className="flex flex-col">
                          <Input
                            type="hidden"
                            label=""
                            name="id"
                            defaultValue={product.id}
                          />

                          <Input
                            label="Descrição do Produto"
                            name="description"
                            containerClass="flex-row items-center"
                            className="mt-0 ml-2"
                            defaultValue={product.description}
                            required
                          />

                          <div className="flex justify-around mt-4">
                            <Input
                              label="Und. Medida"
                              name="measurement"
                              list="product-measurement-list"
                              defaultValue={product.measurement}
                              required
                            />

                            <Input
                              label="Qtde em Estoque"
                              type="number"
                              name="quantity"
                              min={0}
                              required
                              defaultValue={product.quantity}
                              onChange={() => {
                                calculateTotalAmount(`products[${index}]`);
                              }}
                            />

                            <Input
                              label="Valor Unitário"
                              name="amount"
                              required
                              defaultValue={product.amount}
                              className="text-end"
                              onChange={() => {
                                calculateTotalAmount(`products[${index}]`);
                              }}
                            />

                            <Input
                              label="Valor Total"
                              name="total_amount"
                              defaultValue={product.total_amount}
                              className="text-end"
                              disabled
                            />
                          </div>
                        </section>
                      </fieldset>
                    </li>
                  </Scope>
                ))}
              </ul>

              <datalist id="product-measurement-list">
                <option label="Quilograma" value="Quilograma" />
                <option label="Grama" value="Grama" />
                <option label="Litros" value="Litros" />
                <option label="Mililitros" value="Mililitros" />
                <option label="Quilômetros" value="Quilômetros" />
                <option label="Metros" value="Metros" />
              </datalist>
            </fieldset>

            <fieldset className={`${styles.session} flex-row`}>
              <legend className="fs-color-white">Anexos</legend>

              <button
                type="button"
                className="self-baseline mr-4 bg-slate-800"
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
                // required
                ref={inputFileRef}
                onChange={filesChange}
                className="hidden"
              />

              {attachments.length > 0 && (
                <fieldset className={`${styles.session} w-full`}>
                  <legend className="fs-color-white">Documentos</legend>

                  <ul className={styles.attachments} id="attachments">
                    {attachments.map((attachment) => (
                      <li
                        key={attachment.blobKey}
                        className="attachment flex items-center"
                      >
                        <button
                          type="button"
                          className="p-2 text-red-500 hover:text-red-600 hover:border-red-600 border border-solid"
                          onClick={() => {
                            handleRemoveAttachment(attachment.blobKey);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-2 mx-2 text-emerald-500 hover:text-emerald-600 hover:border-emerald-600"
                          onClick={() => {
                            handleViewAttachment(attachment);
                          }}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <p className="ml-2">{attachment.name}</p>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              )}
            </fieldset>
          </fieldset>
        </Form>
      </main>
    </div>
  );
}
