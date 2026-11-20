# Week 4 reference code

Tested solutions for the Week 4 labs. Give students the *task*, not these files.

| File | What it is |
|---|---|
| `weather.py` | Calls the Open-Meteo forecast API and prints the temperature in Baku. No API key. |
| `weather_offline.py` + `sample.json` | Same program, no internet. Use if the school network blocks the API. |
| `app.py` | The same idea as a Streamlit page: `pip install streamlit requests`, then `streamlit run app.py`. |

**Verified:** the parsing logic against the documented response shape, and `app.py` under Streamlit's own
test harness (Streamlit 1.67), with the HTTP call mocked. **Not verified from the build environment:**
the live call to `api.open-meteo.com` (that host was blocked there). Run `python weather.py` once on the
network you will teach on, before class.
