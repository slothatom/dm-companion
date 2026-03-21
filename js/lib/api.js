// =============================================
//   api.js - D&D 5e API Client (Open5e + dnd5eapi.co)
// =============================================
//
// Shared fetch helpers with in-memory + localStorage caching,
// error handling, and loading state management.
//
// Primary:  https://api.open5e.com  (OGL content, full text, CORS)
// Fallback: https://www.dnd5eapi.co (SRD content, CORS)
// =============================================

var DndApi = (function () {

  const OPEN5E   = 'https://api.open5e.com';
  const DND5EAPI = 'https://www.dnd5eapi.co/api';

  // In-memory cache + localStorage for persistence across tabs/sessions
  let _memCache = {};

  // Cache TTL: 4 hours for API data (reduces cold-load fetches)
  const CACHE_TTL = 4 * 60 * 60 * 1000;

  // ── Helpers ─────────────────────────────────────────────

  function cacheKey(url) {
    return 'dnd-api-' + url;
  }

  function getCache(url) {
    // Memory first
    if (_memCache[url] && Date.now() - _memCache[url].ts < CACHE_TTL) {
      return _memCache[url].data;
    }
    // localStorage fallback (persists across sessions)
    try {
      var raw = localStorage.getItem(cacheKey(url));
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Date.now() - parsed.ts < CACHE_TTL) {
          _memCache[url] = parsed;
          return parsed.data;
        }
        localStorage.removeItem(cacheKey(url));
      }
    } catch (e) {}
    // Legacy: check sessionStorage and migrate
    try {
      var legacy = sessionStorage.getItem(cacheKey(url));
      if (legacy) {
        var parsed2 = JSON.parse(legacy);
        if (Date.now() - parsed2.ts < CACHE_TTL) {
          _memCache[url] = parsed2;
          try { localStorage.setItem(cacheKey(url), legacy); } catch (e2) {}
          sessionStorage.removeItem(cacheKey(url));
          return parsed2.data;
        }
        sessionStorage.removeItem(cacheKey(url));
      }
    } catch (e) {}
    return null;
  }

  function setCache(url, data) {
    var entry = { data: data, ts: Date.now() };
    _memCache[url] = entry;
    try {
      localStorage.setItem(cacheKey(url), JSON.stringify(entry));
    } catch (e) {
      // localStorage full - just use memory cache
    }
  }

  // ── Core fetch with timeout + retry ─────────────────────

  function fetchWithTimeout(url, timeoutMs) {
    timeoutMs = timeoutMs || 10000;
    return new Promise(function (resolve, reject) {
      var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = setTimeout(function () {
        if (controller) controller.abort();
        reject(new Error('Request timed out'));
      }, timeoutMs);

      var opts = controller ? { signal: controller.signal } : {};
      fetch(url, opts)
        .then(function (res) {
          clearTimeout(timer);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(resolve)
        .catch(function (err) {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  // ── Paginated Open5e fetch (auto-follows ?next) ─────────

  function fetchAllOpen5e(endpoint, params) {
    var url = OPEN5E + endpoint;
    if (params) {
      var qs = Object.keys(params).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
      }).join('&');
      url += '?' + qs;
    }

    var cached = getCache(url);
    if (cached) return Promise.resolve(cached);

    return fetchAllPages(url).then(function (results) {
      setCache(url, results);
      return results;
    });
  }

  // Parallel pagination: fetch page 1, then calculate remaining pages
  // and fetch them all concurrently instead of sequentially
  function fetchAllPages(url) {
    return fetchWithTimeout(url, 30000).then(function (firstPage) {
      var allResults = [];
      if (firstPage.results) {
        allResults = allResults.concat(firstPage.results);
      } else if (Array.isArray(firstPage)) {
        return firstPage;
      }

      // No more pages — done
      if (!firstPage.next || !firstPage.count) {
        return allResults;
      }

      // Calculate how many pages remain and fetch in parallel
      var pageSize = firstPage.results.length;
      if (pageSize <= 0) return allResults;
      var totalPages = Math.ceil(firstPage.count / pageSize);

      if (totalPages <= 1) return allResults;

      // Build URLs for pages 2..N
      var pagePromises = [];
      for (var p = 2; p <= totalPages; p++) {
        var sep = url.indexOf('?') === -1 ? '?' : '&';
        var pageUrl = url + sep + 'page=' + p;
        pagePromises.push(
          fetchWithTimeout(pageUrl, 30000).then(function (data) {
            return data.results || [];
          }).catch(function () { return []; })
        );
      }

      return Promise.all(pagePromises).then(function (pages) {
        pages.forEach(function (results) {
          allResults = allResults.concat(results);
        });
        return allResults;
      });
    });
  }

  // ── Single-resource Open5e fetch ────────────────────────

  function fetchOne(endpoint) {
    var url = OPEN5E + endpoint;
    var cached = getCache(url);
    if (cached) return Promise.resolve(cached);

    return fetchWithTimeout(url, 10000).then(function (data) {
      setCache(url, data);
      return data;
    });
  }

  // ── dnd5eapi.co fetch (backup) ──────────────────────────

  function fetchDnd5eApi(endpoint) {
    var url = DND5EAPI + endpoint;
    var cached = getCache(url);
    if (cached) return Promise.resolve(cached);

    return fetchWithTimeout(url, 10000).then(function (data) {
      setCache(url, data);
      return data;
    });
  }

  // ── Loading state helpers ───────────────────────────────

  function showLoading(containerId) {
    var el = document.getElementById(containerId);
    if (el) {
      el.innerHTML = '<div class="loading-state"><span class="spinner"></span> Loading data from API...</div>';
    }
  }

  function showError(containerId, message) {
    var el = document.getElementById(containerId);
    if (el) {
      el.innerHTML = '<div class="loading-state" style="color:#aa4040;">' +
        '<p>Failed to load data: ' + escapeHtml(message) + '</p>' +
        '<button onclick="location.reload()" style="margin-top:8px;">Retry</button>' +
      '</div>';
    }
  }

  // =============================================
  //   Resource-specific fetch methods
  // =============================================

  // ── Spells ──────────────────────────────────────────────

  function fetchSpells() {
    return fetchAllOpen5e('/v1/spells/', { limit: 500, document__slug: 'wotc-srd' }).then(function (raw) {
      return raw.map(function (s) {
        return {
          name:       s.name,
          level:      s.level_int != null ? s.level_int : (s.spell_level || 0),
          school:     s.school || '',
          cast:       s.casting_time || '',
          range:      s.range || '',
          duration:   s.duration || '',
          conc:       !!s.requires_concentration || (s.concentration && s.concentration !== 'no'),
          ritual:     !!s.can_be_cast_as_ritual || s.ritual === 'yes',
          components: buildComponents(s),
          material:   s.material || '',
          desc:       s.desc || '',
          higherLevel: s.higher_level || '',
          classes:    s.dnd_class ? s.dnd_class.split(',').map(function (c) { return c.trim(); }) : [],
          _raw: s
        };
      }).sort(function (a, b) {
        if (a.level !== b.level) return a.level - b.level;
        return a.name.localeCompare(b.name);
      });
    });
  }

  function buildComponents(s) {
    var parts = [];
    if (s.requires_verbal_components)   parts.push('V');
    if (s.requires_somatic_components)  parts.push('S');
    if (s.requires_material_components) parts.push('M');
    var result = parts.join(', ');
    if (s.material && parts.indexOf('M') !== -1) {
      result += ' (' + s.material + ')';
    }
    return result || s.components || '';
  }

  // ── Monsters ────────────────────────────────────────────

  function fetchMonsters() {
    return fetchAllOpen5e('/v1/monsters/', { limit: 1000, document__slug: 'wotc-srd' }).then(function (raw) {
      return raw.map(function (m) {
        return {
          name:       m.name,
          cr:         m.cr != null ? String(m.cr) : '0',
          type:       m.type || '',
          subtype:    m.subtype || '',
          size:       m.size || '',
          alignment:  m.alignment || '',
          ac:         m.armor_class || 0,
          acDesc:     m.armor_desc || '',
          hp:         m.hit_points || 0,
          hitDice:    m.hit_dice || '',
          image:      m.img_main || '',
          speed:      m.speed ? formatSpeed(m.speed) : '30 ft',
          str:        m.strength || 10,
          dex:        m.dexterity || 10,
          con:        m.constitution || 10,
          int:        m.intelligence || 10,
          wis:        m.wisdom || 10,
          cha:        m.charisma || 10,
          saves:      formatSaves(m),
          skills:     formatObj(m.skills),
          vulnerabilities: m.damage_vulnerabilities || '',
          resistances:     m.damage_resistances || '',
          immunities:      m.damage_immunities || '',
          conditionImmunities: m.condition_immunities || '',
          senses:     m.senses || '',
          languages:  m.languages || '',
          actions:    formatActions(m.actions),
          bonusActions: formatActions(m.bonus_actions),
          reactions:  formatActions(m.reactions),
          abilities:  formatAbilities(m.special_abilities),
          legendary:  formatActions(m.legendary_actions),
          legendaryDesc: m.legendary_desc || '',
          _raw: m
        };
      }).sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    });
  }

  function formatSpeed(spd) {
    if (typeof spd === 'string') return spd;
    if (typeof spd === 'object') {
      return Object.keys(spd).map(function (k) {
        return k === 'walk' ? spd[k] + ' ft' : k + ' ' + spd[k] + ' ft';
      }).join(', ');
    }
    return '30 ft';
  }

  function formatSaves(m) {
    var saves = [];
    if (m.strength_save != null)     saves.push('STR +' + m.strength_save);
    if (m.dexterity_save != null)    saves.push('DEX +' + m.dexterity_save);
    if (m.constitution_save != null) saves.push('CON +' + m.constitution_save);
    if (m.intelligence_save != null) saves.push('INT +' + m.intelligence_save);
    if (m.wisdom_save != null)       saves.push('WIS +' + m.wisdom_save);
    if (m.charisma_save != null)     saves.push('CHA +' + m.charisma_save);
    return saves.join(', ');
  }

  function formatObj(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return Object.keys(obj).map(function (k) {
      return k.charAt(0).toUpperCase() + k.slice(1) + ' +' + obj[k];
    }).join(', ');
  }

  function formatActions(actions) {
    if (!actions || !actions.length) return '';
    return actions.map(function (a) {
      return a.name + ': ' + (a.desc || '');
    }).join('\n\n');
  }

  function formatAbilities(abilities) {
    if (!abilities || !abilities.length) return '';
    return abilities.map(function (a) {
      return a.name + ': ' + (a.desc || '');
    }).join('\n\n');
  }

  // ── Equipment / Items ───────────────────────────────────

  function fetchEquipment() {
    // Equipment: prefer static ITEMS data (comprehensive SRD set),
    // API fetch as enhancement only. Use Open5e weapons + armor endpoints.
    return Promise.all([
      fetchAllOpen5e('/v2/weapons/', { limit: 200 }).catch(function () { return []; }),
      fetchAllOpen5e('/v2/armor/', { limit: 100 }).catch(function () { return []; })
    ]).then(function (results) {
      var weapons = results[0] || [];
      var armor = results[1] || [];
      var allItems = [];

      weapons.forEach(function (w) { allItems.push(normalizeWeapon(w)); });
      armor.forEach(function (a) { allItems.push(normalizeArmor(a)); });

      return allItems.sort(function (a, b) { return a.name.localeCompare(b.name); });
    });
  }

  function formatCost(c) {
    if (!c) return '';
    if (typeof c === 'string') return c;
    if (typeof c === 'object') return (c.quantity || '') + ' ' + (c.unit || '');
    return String(c);
  }

  function formatWeight(w) {
    if (!w) return '';
    if (typeof w === 'string') return w;
    return String(w) + ' lb';
  }

  function normalizeWeapon(w) {
    var props = [];
    if (w.properties) {
      if (Array.isArray(w.properties)) {
        props = w.properties.map(function (p) { return typeof p === 'string' ? p : p.name || ''; });
      } else {
        props = [String(w.properties)];
      }
    }
    var dmgType = w.damage_type
      ? (typeof w.damage_type === 'string' ? w.damage_type : w.damage_type.name || '')
      : '';
    var catLabel = w.category
      ? (typeof w.category === 'string' ? w.category : w.category.name || '')
      : 'Weapon';
    return {
      name:       w.name || '',
      category:   'weapon',
      cost:       formatCost(w.cost),
      weight:     formatWeight(w.weight),
      properties: props.join(', '),
      desc:       catLabel + '. ' + (w.damage_dice || '') + (dmgType ? ' ' + dmgType : '') + ' damage.',
      _raw: w
    };
  }

  function normalizeArmor(a) {
    var catLabel = a.category
      ? (typeof a.category === 'string' ? a.category : a.category.name || 'Armor')
      : 'Armor';
    return {
      name:       a.name || '',
      category:   'armor',
      cost:       formatCost(a.cost),
      weight:     formatWeight(a.weight),
      properties: 'AC ' + (a.base_ac || a.armor_class || '') + (a.plus_dex_mod ? ' + DEX' : '') + (a.plus_max ? ' (max ' + a.plus_max + ')' : ''),
      desc:       catLabel + '. ' + (a.stealth_disadvantage ? 'Disadvantage on Stealth.' : ''),
      _raw: a
    };
  }

  // ── Magic Items ─────────────────────────────────────────

  function fetchMagicItems() {
    return fetchAllOpen5e('/v1/magicitems/', { limit: 500 }).then(function (raw) {
      return raw.map(function (item) {
        return {
          name:     item.name || '',
          type:     item.type || '',
          rarity:   item.rarity || '',
          attune:   item.requires_attunement || '',
          desc:     item.desc || '',
          _raw: item
        };
      }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    });
  }

  // ── Classes ─────────────────────────────────────────────

  function fetchClasses() {
    return fetchAllOpen5e('/v1/classes/', { limit: 50, document__slug: 'wotc-srd' }).then(function (raw) {
      return raw.map(function (c) {
        return {
          name:           c.name || '',
          hitDie:         c.hit_dice ? ('d' + c.hit_dice) : '',
          primaryAbility: c.primary_ability || '',
          savingThrows:   c.saving_throws || '',
          armorProf:      c.prof_armor || '',
          weaponProf:     c.prof_weapons || '',
          skillChoices:   c.prof_skills || '',
          features:       c.class_features || '',
          subclassName:   c.subtypes_name || '',
          spellcasting:   c.spellcasting_ability || '',
          desc:           c.desc || '',
          _raw: c
        };
      }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    });
  }

  // ── Races / Species ─────────────────────────────────────

  function fetchRaces() {
    return fetchAllOpen5e('/v1/races/', { limit: 50, document__slug: 'wotc-srd' }).then(function (raw) {
      return raw.map(function (r) {
        return {
          name:      r.name || '',
          size:      r.size || '',
          speed:     r.speed ? formatSpeed(r.speed) : '',
          languages: r.languages || '',
          traits:    r.traits || '',
          subraces:  (r.subraces || []).map(function (sub) {
            return { name: sub.name || '', traits: sub.traits || sub.desc || '' };
          }),
          desc:      r.desc || '',
          _raw: r
        };
      }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    });
  }

  // ── Feats ───────────────────────────────────────────────

  function fetchFeats() {
    return fetchAllOpen5e('/v1/feats/', { limit: 200 }).then(function (raw) {
      return raw.map(function (f) {
        return {
          name:         f.name || '',
          prerequisite: f.prerequisite || '',
          desc:         f.desc || '',
          _raw: f
        };
      }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    });
  }

  // ── Backgrounds ─────────────────────────────────────────

  function fetchBackgrounds() {
    return fetchAllOpen5e('/v1/backgrounds/', { limit: 100, document__slug: 'wotc-srd' }).then(function (raw) {
      return raw.map(function (b) {
        return {
          name:        b.name || '',
          desc:        b.desc || '',
          skillProf:   b.skill_proficiencies || '',
          toolProf:    b.tool_proficiencies || '',
          languages:   b.languages || '',
          equipment:   b.equipment || '',
          feature:     b.feature || '',
          featureDesc: b.feature_desc || '',
          personality: b.suggested_characteristics || '',
          _raw: b
        };
      }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    });
  }

  // ── Languages ───────────────────────────────────────────

  function fetchLanguages() {
    return fetchDnd5eApi('/languages').then(function (data) {
      var slugs = (data.results || []).map(function (l) { return l.index; });
      return Promise.all(slugs.map(function (slug) {
        return fetchDnd5eApi('/languages/' + slug);
      }));
    }).then(function (langs) {
      return langs.map(function (l) {
        return {
          name:     l.name || '',
          type:     l.type || 'Standard',
          script:   l.script || 'None',
          speakers: (l.typical_speakers || []).join(', '),
          desc:     l.desc || ''
        };
      }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    });
  }

  // ── Conditions ──────────────────────────────────────────

  function fetchConditions() {
    return fetchDnd5eApi('/conditions').then(function (data) {
      var slugs = (data.results || []).map(function (c) { return c.index; });
      return Promise.all(slugs.map(function (slug) {
        return fetchDnd5eApi('/conditions/' + slug);
      }));
    }).then(function (conditions) {
      return conditions.map(function (c) {
        return {
          name: c.name || '',
          desc: (c.desc || []).join('\n\n')
        };
      }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    });
  }

  // ── Rules Sections ──────────────────────────────────────

  function fetchRuleSections() {
    return fetchAllOpen5e('/v1/sections/', { limit: 200, document__slug: 'wotc-srd' }).then(function (raw) {
      return raw.map(function (s) {
        return {
          name:    s.name || '',
          desc:    s.desc || '',
          parent:  s.parent || '',
          _raw: s
        };
      }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    });
  }

  // ── Ability Scores (from dnd5eapi) ──────────────────────

  function fetchAbilityScores() {
    return fetchDnd5eApi('/ability-scores').then(function (data) {
      var slugs = (data.results || []).map(function (a) { return a.index; });
      return Promise.all(slugs.map(function (slug) {
        return fetchDnd5eApi('/ability-scores/' + slug);
      }));
    }).then(function (scores) {
      return scores.map(function (s) {
        return {
          name:     s.full_name || s.name || '',
          abbrev:   s.name || '',
          desc:     (s.desc || []).join('\n\n'),
          skills:   (s.skills || []).map(function (sk) { return sk.name; })
        };
      });
    });
  }

  // ── Public API ──────────────────────────────────────────

  return {
    fetchSpells:        fetchSpells,
    fetchMonsters:      fetchMonsters,
    fetchEquipment:     fetchEquipment,
    fetchMagicItems:    fetchMagicItems,
    fetchClasses:       fetchClasses,
    fetchRaces:         fetchRaces,
    fetchFeats:         fetchFeats,
    fetchBackgrounds:   fetchBackgrounds,
    fetchLanguages:     fetchLanguages,
    fetchConditions:    fetchConditions,
    fetchRuleSections:  fetchRuleSections,
    fetchAbilityScores: fetchAbilityScores,
    showLoading:        showLoading,
    showError:          showError,
    // Expose for advanced use
    fetchAllOpen5e:     fetchAllOpen5e,
    fetchOne:           fetchOne,
    fetchDnd5eApi:      fetchDnd5eApi,
    clearCache: function () {
      _memCache = {};
      // Clear from both localStorage and legacy sessionStorage
      [localStorage, sessionStorage].forEach(function (store) {
        try {
          var keys = [];
          for (var i = 0; i < store.length; i++) {
            var k = store.key(i);
            if (k && k.indexOf('dnd-api-') === 0) keys.push(k);
          }
          keys.forEach(function (k) { store.removeItem(k); });
        } catch (e) {}
      });
    }
  };

})();
