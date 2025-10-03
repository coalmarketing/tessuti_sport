---
layout: "layouts/category.njk"
pagination:
  data: collections.productCategories
  size: 1
  alias: cat
permalink: "/cs/katalog/{{ cat.slug }}/"
eleventyComputed:
  title: "Katalog – {{ cat.name }}"
---