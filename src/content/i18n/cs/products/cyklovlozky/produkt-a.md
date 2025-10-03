---
title: "Produkt A"
slug: "produkt-a"
category: "Cyklovložky"

# DŮLEŽITÉ – musí to být seznam (list), ne řetězec!
tags:
  - product
  - cs

layout: "layouts/product.njk"
permalink: "/cs/katalog/{{ category | slug }}/{{ slug }}/"

# volitelné
image: "/assets/images/cms/neco.jpg"
price: 199
currency: "CZK"
---

Popis produktu A…
