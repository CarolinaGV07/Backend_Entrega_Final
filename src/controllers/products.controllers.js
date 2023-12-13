import { productService } from "../services/index.js";

export const getProducts = async (req, res) => {
  try {
    const { user } = req.user;
    const { first_name, last_name, rol } = user;
    const page = parseInt(req.query.page) || 2;
    const limit = parseInt(req.query.limit) || 3;
    const queryParams = req.query.query || "";
    const sort = parseInt(req.query.sort);
    let products;
    if (page || limit || queryParams || sort) {
      products = await productService.getProductsPaginate(
        page,
        limit,
        queryParams,
        sort
      );
    } else {
      products = await productService.getProducts();
    }
    const productsPrev = products.productsPrev;
    const productsNext = products.productsNext;
    const productsPrevValidate = products.paginaAnterior;
    const productsNextValidate = products.paginaSiguiente;
    products = products.productsPaginate;
    res.render("products", {
      products,
      last_name,
      first_name,
      rol,
      productsPrev,
      productsNext,
      productsPrevValidate,
      productsNextValidate,
      css: "products",
    });
  } catch (error) {
    req.logger.fatal("Error al obtener los productos");
    res.send({ error: error.message });
  }
};

export const getProductsRealTime = async (req, res) => {
  try {
    const { user } = req.user;
    const { first_name, last_name, rol } = user;
    let products = await productService.getProducts();
    if (user.rol === "admin") {
      res.render("realtimeproducts", {
        products,
        last_name,
        first_name,
        rol,
        css: "realtimeproducts",
      });
    } else {
      throw new Error("No authorized");
    }
  } catch (error) {
    req.logger.fatal("Error al obtener los productos");
    res.send({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    res.status(200).json(product);
  } catch (error) {
    req.logger.fatal("Error al obtener el producto");
    res.status(500).json({ error: error.message });
  }
};
export const addProduct = async (req, res) => {
  try {
    const product = await productService.addProduct(req.body);
    res.status(201).send(product);
  } catch (error) {
    req.logger.fatal("Error al agregar el producto");
    res.status(500).json({ error: error.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.pid, req.body);
    res.status(200).json(product);
  } catch (error) {
    req.logger.fatal("Error al actualizar el producto");
    res.status(500).json({ error: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(
      req.params.pid,
      req.user.user.email
    );
    res.status(200).json(product);
  } catch (error) {
    req.logger.fatal("Error al eliminar el producto");
    res.status(500).json({ error: error.message });
  }
};
export const getProductsPaginate = async (req, res) => {
  try {
    const products = await productService.getProductsPaginate(
      req.query.page,
      req.query.limit,
      req.query,
      req.query.sort
    );
    res.status(200).json(products);
  } catch (error) {
    req.logger.fatal("Error al obtener los productos");
    res.status(500).json({ error: error.message });
  }
};
export const getProductsLimit = async (req, res) => {
  try {
    const products = await productService.getProductsLimit(req.query.limit);
    req.logger.error("Error al obtener los productos");
    res.status(200).json(products);
  } catch (error) {
    req.logger.fatal("Error al obtener los productos");
    res.status(500).json({ error: error.message });
  }
};
